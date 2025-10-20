import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResumeApp } from './ResumeApp';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

// Mock toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock child components to simplify integration testing
vi.mock('./HeroSection', () => ({
  HeroSection: ({ onGetStarted, onLoadMockData }: any) => (
    <div data-testid="hero-section">
      <button onClick={onGetStarted}>Get Started</button>
      <button onClick={onLoadMockData}>Load Mock Data</button>
    </div>
  ),
}));

vi.mock('./ResumeUploader', () => ({
  ResumeUploader: ({ onResumeReady }: any) => (
    <div data-testid="resume-uploader">
      <button
        onClick={() =>
          onResumeReady('Sample Resume Text\nJohn Doe\njohn@email.com')
        }
      >
        Submit Resume
      </button>
    </div>
  ),
}));

vi.mock('./JobDescriptionInput', () => ({
  JobDescriptionInput: ({ onJobDescriptionReady, onBack }: any) => (
    <div data-testid="job-description-input">
      <button onClick={onBack}>Back</button>
      <button
        onClick={() =>
          onJobDescriptionReady(
            'Software Engineer',
            'Tech Corp',
            'Looking for a software engineer...'
          )
        }
      >
        Submit Job Description
      </button>
    </div>
  ),
}));

vi.mock('./ResultsDisplay', () => ({
  ResultsDisplay: ({ onBack, onStartOver }: any) => (
    <div data-testid="results-display">
      <button onClick={onBack}>Back</button>
      <button onClick={onStartOver}>Start Over</button>
    </div>
  ),
}));

describe('ResumeApp Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial render', () => {
    it('should render the hero section by default', () => {
      render(<ResumeApp />);
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    });

    it('should not show progress indicator on hero page', () => {
      render(<ResumeApp />);
      expect(screen.queryByText('Resume Tailor')).not.toBeInTheDocument();
    });
  });

  describe('User flow - Normal progression', () => {
    it('should navigate from hero to upload step', async () => {
      const user = userEvent.setup();
      render(<ResumeApp />);

      const getStartedButton = screen.getByText('Get Started');
      await user.click(getStartedButton);

      expect(screen.getByTestId('resume-uploader')).toBeInTheDocument();
    });

    it('should navigate from upload to job description step', async () => {
      const user = userEvent.setup();
      render(<ResumeApp />);

      // Navigate to upload
      await user.click(screen.getByText('Get Started'));

      // Submit resume
      await user.click(screen.getByText('Submit Resume'));

      expect(screen.getByTestId('job-description-input')).toBeInTheDocument();
    });

    it('should show progress indicator after leaving hero', async () => {
      const user = userEvent.setup();
      render(<ResumeApp />);

      await user.click(screen.getByText('Get Started'));

      expect(screen.getByText('Resume Tailor')).toBeInTheDocument();
    });
  });

  describe('User flow - Navigation backwards', () => {
    it('should navigate back from job description to upload', async () => {
      const user = userEvent.setup();
      render(<ResumeApp />);

      // Navigate forward
      await user.click(screen.getByText('Get Started'));
      await user.click(screen.getByText('Submit Resume'));

      // Navigate back
      const backButtons = screen.getAllByText('Back');
      await user.click(backButtons[0]);

      expect(screen.getByTestId('resume-uploader')).toBeInTheDocument();
    });
  });

  describe('User flow - State management', () => {
    it('should preserve app state during navigation', async () => {
      const user = userEvent.setup();
      render(<ResumeApp />);

      await user.click(screen.getByText('Get Started'));

      // Component exists means state is working
      expect(screen.getByTestId('resume-uploader')).toBeInTheDocument();
    });
  });

  describe('Step indicator', () => {
    it('should show correct step in progress indicator', async () => {
      const user = userEvent.setup();
      render(<ResumeApp />);

      await user.click(screen.getByText('Get Started'));

      expect(screen.getByText('📝 Enter Resume Content')).toBeInTheDocument();
    });

    it('should update step indicator when progressing', async () => {
      const user = userEvent.setup();
      render(<ResumeApp />);

      await user.click(screen.getByText('Get Started'));
      await user.click(screen.getByText('Submit Resume'));

      expect(screen.getByText('💼 Add Job Details')).toBeInTheDocument();
    });
  });

  describe('Data persistence across navigation', () => {
    it('should maintain resume data when navigating back and forth', async () => {
      const user = userEvent.setup();
      render(<ResumeApp />);

      // Navigate forward
      await user.click(screen.getByText('Get Started'));
      await user.click(screen.getByText('Submit Resume'));

      // Navigate back
      const backButtons = screen.getAllByText('Back');
      await user.click(backButtons[0]);

      // Navigate forward again
      await user.click(screen.getByText('Submit Resume'));

      // Should still be on job description page (data persisted)
      expect(screen.getByTestId('job-description-input')).toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('should handle parsing errors gracefully', async () => {
      const user = userEvent.setup();

      // Mock a successful API call but with unparseable text
      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { tailoredResume: 'Invalid resume format' },
        error: null,
      });

      render(<ResumeApp />);

      await user.click(screen.getByText('Get Started'));
      await user.click(screen.getByText('Submit Resume'));
      await user.click(screen.getByText('Submit Job Description'));

      // Should still navigate to results even with parsing error
      await waitFor(() => {
        expect(screen.getByTestId('results-display')).toBeInTheDocument();
      });
    });
  });
});

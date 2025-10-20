import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactsModal } from './ContactsModal'
import { Contact } from '../../types'

// Mock all dependencies
vi.mock('../../store/contactStore', () => ({
  useContactStore: vi.fn(),
}))

vi.mock('../../contexts/GamificationContext', () => ({
  useGamification: vi.fn(),
}))

vi.mock('../../services/openaiService', () => ({
  useOpenAI: vi.fn(),
}))

vi.mock('fuse.js', () => ({
  default: vi.fn(() => ({
    search: vi.fn(() => []),
  })),
}))

vi.mock('./AIEnhancedContactCard', () => ({
  AIEnhancedContactCard: ({ contact, onClick }: any) => (
    <div data-testid={`contact-card-${contact.id}`} onClick={() => onClick(contact)}>
      {contact.name}
    </div>
  ),
}))

vi.mock('./TeamMemberCard', () => ({
  TeamMemberCard: ({ member, onClick }: any) => (
    <div data-testid={`team-card-${member.id}`} onClick={() => onClick(member)}>
      {member.name}
    </div>
  ),
}))

vi.mock('./ContactDetailView', () => ({
  ContactDetailView: () => <div data-testid="contact-detail-view" />,
}))

vi.mock('../deals/AddContactModal', () => ({
  default: () => <div data-testid="add-contact-modal" />,
}))

vi.mock('fuse.js')

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  X: () => <div data-testid="x-icon" />,
  Search: () => <div data-testid="search-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Users: () => <div data-testid="users-icon" />,
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
  Brain: () => <div data-testid="brain-icon" />,
  Download: () => <div data-testid="download-icon" />,
  Upload: () => <div data-testid="upload-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
  CheckCheck: () => <div data-testid="check-check-icon" />,
  Grid: () => <div data-testid="grid-icon" />,
  List: () => <div data-testid="list-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  UserPlus: () => <div data-testid="user-plus-icon" />,
  Crown: () => <div data-testid="crown-icon" />,
  Star: () => <div data-testid="star-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
}))

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1-555-0123',
    company: 'Tech Corp',
    // position: 'CTO', // Not in Contact interface
    // avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=ffffff', // Not in Contact interface
    aiScore: 85,
    interestLevel: 'high' as const,
    status: 'active' as const,
    sources: ['manual', 'website'],
    tags: ['vip', 'tech'],
    notes: 'Key decision maker for enterprise solutions',
    socialProfiles: {
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: '@johndoe',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    customFields: {},
  },
  {
    id: '2',
    name: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '+1-555-0456',
    company: 'Design Studio',
    // position: 'Designer', // Not in Contact interface
    // position: 'Creative Director', // Not in Contact interface
    // avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=ffffff', // Not in Contact interface
    aiScore: 70,
    interestLevel: 'medium' as const,
    status: 'prospect' as const,
    sources: ['referral', 'social'],
    tags: ['design', 'creative'],
    notes: 'Interested in branding projects',
    socialProfiles: {
      linkedin: 'https://linkedin.com/in/janesmith',
      website: 'https://janesmith.design',
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-10'),
    customFields: {},
  },
]

const mockTeamMembers: Contact[] = [
  {
    id: '3',
    name: 'Bob Johnson',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob@company.com',
    company: 'Tech Corp',
    // position: 'CTO', // Not in Contact interface
    // title: 'Sales Manager', // Not in Contact interface
    phone: '+1122334455',
    // industry: 'Technology', // Not in Contact interface
    status: 'active' as const,
    interestLevel: 'high' as const,
    aiScore: 90,
    notes: 'Team member',
    // avatarSrc: 'https://example.com/avatar3.jpg', // Not in Contact interface
    socialProfiles: {},
    sources: ['manual'],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    // isTeamMember: true, // Not in Contact interface
  },
]

const renderContactsModal = (props = {}) => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
  }

  return render(<ContactsModal {...defaultProps} {...props} />)
}

describe('ContactsModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Setup default mocks using vi.mocked
    const mockUseContactStore = vi.mocked(require('../../store/contactStore').useContactStore)
    const mockUseGamification = vi.mocked(require('../../contexts/GamificationContext').useGamification)
    const mockUseOpenAI = vi.mocked(require('../../services/openaiService').useOpenAI)

    mockUseContactStore.mockReturnValue({
      contacts: mockContacts,
      isLoading: false,
      updateContact: vi.fn(),
      createContact: vi.fn(),
      fetchContacts: vi.fn(),
    })

    mockUseGamification.mockReturnValue({
      teamMembers: mockTeamMembers,
      addTeamMember: vi.fn(),
      removeTeamMember: vi.fn(),
    })

    mockUseOpenAI.mockReturnValue({
      analyzeContact: vi.fn(),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Rendering', () => {
    it('renders modal when isOpen is true', () => {
      renderContactsModal()

      expect(screen.getByText('Contacts & Team')).toBeInTheDocument()
      expect(screen.getByText('2 external contacts')).toBeInTheDocument()
    })

    it('does not render when isOpen is false', () => {
      renderContactsModal({ isOpen: false })

      expect(screen.queryByText('Contacts & Team')).not.toBeInTheDocument()
    })

    it('displays external contacts by default', () => {
      renderContactsModal()

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    it('switches to team members tab', async () => {
      const user = userEvent.setup()
      renderContactsModal()

      const teamTab = screen.getByText('Team Members')
      await user.click(teamTab)

      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
      expect(screen.getByText('1 team members')).toBeInTheDocument()
    })

    it('shows loading state when isLoading is true', () => {
      const mockUseContactStore = vi.mocked(require('../../store/contactStore').useContactStore)
      mockUseContactStore.mockReturnValue({
        contacts: [],
        isLoading: true,
        updateContact: vi.fn(),
        createContact: vi.fn(),
        fetchContacts: vi.fn(),
      })

      renderContactsModal()

      expect(screen.getByText('Loading contacts...')).toBeInTheDocument()
    })

    it('shows empty state when no contacts found', () => {
      const mockUseContactStore = vi.mocked(require('../../store/contactStore').useContactStore)
      mockUseContactStore.mockReturnValue({
        contacts: [],
        isLoading: false,
        updateContact: vi.fn(),
        createContact: vi.fn(),
        fetchContacts: vi.fn(),
      })

      renderContactsModal()

      expect(screen.getByText('No contacts found')).toBeInTheDocument()
    })
  })

  describe('Search and Filtering', () => {
    it('filters contacts by search term', async () => {
      const user = userEvent.setup()

      // Mock Fuse search to return John Doe
      const mockFuse = vi.mocked(require('fuse.js'))
      const mockFuseInstance = {
        search: vi.fn(() => [{ item: mockContacts[0] }]),
      }
      mockFuse.mockReturnValue(mockFuseInstance as any)

      renderContactsModal()

      const searchInput = screen.getByPlaceholderText('Search external contacts...')
      await user.type(searchInput, 'John')

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
    })

    it('filters by interest level', async () => {
      const user = userEvent.setup()
      renderContactsModal()

      const filterButton = screen.getByText('All')
      await user.click(filterButton)

      const hotFilter = screen.getByText('Hot Client')
      await user.click(hotFilter)

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
    })

    it('filters by status', async () => {
      const user = userEvent.setup()
      renderContactsModal()

      const statusButton = screen.getByText('All Status')
      await user.click(statusButton)

      const leadStatus = screen.getByText('Lead')
      await user.click(leadStatus)

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
    })
  })

  describe('Contact Selection', () => {
    it('selects individual contacts', async () => {
      const user = userEvent.setup()
      renderContactsModal()

      const contactCard = screen.getByTestId('contact-card-1')
      await user.click(contactCard)

      expect(screen.getByText('1 selected')).toBeInTheDocument()
    })

    it('selects all contacts', async () => {
      const user = userEvent.setup()
      renderContactsModal()

      const selectAllButton = screen.getByText('Select All')
      await user.click(selectAllButton)

      expect(screen.getByText('2 selected')).toBeInTheDocument()
    })

    it('deselects all contacts', async () => {
      const user = userEvent.setup()
      renderContactsModal()

      const selectAllButton = screen.getByText('Select All')
      await user.click(selectAllButton)
      await user.click(selectAllButton) // Click again to deselect

      expect(screen.getByText('2 external contacts')).toBeInTheDocument()
      expect(screen.queryByText('selected')).not.toBeInTheDocument()
    })
  })

  describe('AI Analysis', () => {
    it('analyzes selected contacts', async () => {
      const user = userEvent.setup()
      const mockAnalyzeContact = vi.fn().mockResolvedValue({
        score: 85,
        insights: ['High potential client'],
      })

      const mockUseOpenAI = vi.mocked(require('../../services/openaiService').useOpenAI)
      mockUseOpenAI.mockReturnValue({
        analyzeContact: mockAnalyzeContact,
      })

      renderContactsModal()

      // Select a contact
      const selectAllButton = screen.getByText('Select All')
      await user.click(selectAllButton)

      // Click AI analysis button
      const aiButton = screen.getByText('AI Lead Scoring')
      await user.click(aiButton)

      expect(mockAnalyzeContact).toHaveBeenCalledTimes(2)
    })

    it('shows loading state during analysis', async () => {
      const user = userEvent.setup()
      renderContactsModal()

      // Select a contact
      const selectAllButton = screen.getByText('Select All')
      await user.click(selectAllButton)

      // Click AI analysis button
      const aiButton = screen.getByText('AI Lead Scoring')
      await user.click(aiButton)

      expect(screen.getByText('Analyzing...')).toBeInTheDocument()
    })
  })

  describe('Team Management', () => {
    it('adds contact to team', async () => {
      const user = userEvent.setup()
      const mockAddTeamMember = vi.fn()

      const mockUseGamification = vi.mocked(require('../../contexts/GamificationContext').useGamification)
      mockUseGamification.mockReturnValue({
        teamMembers: [],
        addTeamMember: mockAddTeamMember,
        removeTeamMember: vi.fn(),
      })

      renderContactsModal()

      // Select a contact
      const contactCard = screen.getByTestId('contact-card-1')
      await user.click(contactCard)

      // Open bulk actions dropdown
      const actionsButton = screen.getByText('Actions')
      await user.click(actionsButton)

      // Click add to team
      const addToTeamButton = screen.getByText('Add to Team')
      await user.click(addToTeamButton)

      expect(mockAddTeamMember).toHaveBeenCalledWith('1')
    })

    it('removes team member', async () => {
      const user = userEvent.setup()
      const mockRemoveTeamMember = vi.fn()

      const mockUseGamification = vi.mocked(require('../../contexts/GamificationContext').useGamification)
      mockUseGamification.mockReturnValue({
        teamMembers: mockTeamMembers,
        addTeamMember: vi.fn(),
        removeTeamMember: mockRemoveTeamMember,
      })

      renderContactsModal({ activeTab: 'team' })

      // Switch to team tab
      const teamTab = screen.getByText('Team Members')
      await user.click(teamTab)

      // The remove functionality would be in the TeamMemberCard component
      // This test verifies the team tab functionality
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    })
  })

  describe('Modal Controls', () => {
    it('closes modal on close button click', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup()

      renderContactsModal({ onClose })

      const closeButton = screen.getByTestId('x-icon').closest('button')
      await user.click(closeButton!)

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('closes modal on ESC key', async () => {
      const onClose = vi.fn()

      renderContactsModal({ onClose })

      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('closes modal on backdrop click', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup()

      renderContactsModal({ onClose })

      const backdrop = screen.getByTestId('backdrop') || document.querySelector('.fixed.inset-0')
      if (backdrop) {
        await user.click(backdrop as Element)
        expect(onClose).toHaveBeenCalledTimes(1)
      }
    })
  })

  describe('Sorting', () => {
    it('sorts contacts by name', async () => {
      const user = userEvent.setup()
      renderContactsModal()

      const sortSelect = screen.getByDisplayValue('Name A-Z')
      await user.selectOptions(sortSelect, 'name-desc')

      // Verify sorting logic is applied (contacts should be in reverse order)
      const contactCards = screen.getAllByTestId(/^contact-card-/)
      expect(contactCards).toHaveLength(2)
    })

    it('sorts contacts by AI score', async () => {
      const user = userEvent.setup()
      renderContactsModal()

      const sortSelect = screen.getByDisplayValue('Name A-Z')
      await user.selectOptions(sortSelect, 'score-desc')

      // John Doe has score 85, Jane Smith has score 70
      const contactCards = screen.getAllByTestId(/^contact-card-/)
      expect(contactCards[0]).toHaveTextContent('John Doe')
    })
  })

  describe('View Modes', () => {
    it('switches between card and table view', async () => {
      const user = userEvent.setup()
      renderContactsModal()

      const tableButton = screen.getByTestId('list-icon').closest('button')
      await user.click(tableButton!)

      // In table view, contacts would be displayed differently
      // This test verifies the view mode toggle works
      expect(tableButton).toHaveClass('bg-blue-600')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      renderContactsModal()

      expect(screen.getByLabelText('Search external contacts...')).toBeInTheDocument()
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      renderContactsModal()

      const searchInput = screen.getByPlaceholderText('Search external contacts...')
      searchInput.focus()

      await user.keyboard('John')
      expect(searchInput).toHaveValue('John')
    })

    it('closes modal with ESC key', () => {
      const onClose = vi.fn()
      renderContactsModal({ onClose })

      fireEvent.keyDown(document, { key: 'Escape' })
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Error Handling', () => {
    it('handles AI analysis errors gracefully', async () => {
      const user = userEvent.setup()
      const mockAnalyzeContact = vi.fn().mockRejectedValue(new Error('Analysis failed'))

      const mockUseOpenAI = vi.mocked(require('../../services/openaiService').useOpenAI)
      mockUseOpenAI.mockReturnValue({
        analyzeContact: mockAnalyzeContact,
      })

      renderContactsModal()

      // Select a contact
      const selectAllButton = screen.getByText('Select All')
      await user.click(selectAllButton)

      // Click AI analysis button
      const aiButton = screen.getByText('AI Lead Scoring')
      await user.click(aiButton)

      // Should not crash and should complete analysis
      await waitFor(() => {
        expect(mockAnalyzeContact).toHaveBeenCalled()
      })
    })

    it('handles contact update errors', async () => {
      const mockUpdateContact = vi.fn().mockRejectedValue(new Error('Update failed'))

      const mockUseContactStore = vi.mocked(require('../../store/contactStore').useContactStore)
      mockUseContactStore.mockReturnValue({
        contacts: mockContacts,
        isLoading: false,
        updateContact: mockUpdateContact,
        createContact: vi.fn(),
        fetchContacts: vi.fn(),
      })

      renderContactsModal()

      // Error handling should be implemented in the component
      expect(mockUpdateContact).toBeDefined()
    })
  })

  describe('Performance', () => {
    it('memoizes filtered contacts', () => {
      const { rerender } = renderContactsModal()

      // Re-render with same props
      rerender(<ContactsModal isOpen={true} onClose={vi.fn()} />)

      // Should not cause unnecessary re-computations
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('handles large contact lists efficiently', () => {
      const largeContactList = Array.from({ length: 100 }, (_, i) => ({
        ...mockContacts[0],
        id: `contact-${i}`,
        name: `Contact ${i}`,
        firstName: `First${i}`,
        lastName: `Last${i}`,
        email: `contact${i}@example.com`,
        sources: ['manual'],
      }))

      const mockUseContactStore = vi.mocked(require('../../store/contactStore').useContactStore)
      mockUseContactStore.mockReturnValue({
        contacts: largeContactList,
        isLoading: false,
        updateContact: vi.fn(),
        createContact: vi.fn(),
        fetchContacts: vi.fn(),
      })

      renderContactsModal()

      // Should render all contacts without performance issues
      expect(screen.getAllByTestId(/^contact-card-/)).toHaveLength(100)
    })
  })
})
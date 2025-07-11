return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={onClose}></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-2xl sm:rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Deal Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(90vh-73px)]">
            {/* Left column - Deal Details */}
            <div className="p-6 overflow-y-auto border-r border-gray-200 dark:border-gray-700 md:col-span-1">
              {/* Deal Overview */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deal Overview</h3>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <img
                        src={deal.companyAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(deal.company)}&background=3b82f6&color=ffffff&size=40`}
                        alt={deal.company}
                        className="h-12 w-12 rounded-lg border border-gray-200 dark:border-gray-600"
                      />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate">{deal.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{deal.company}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Deal Value */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Deal Value</p>
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(deal.value)}
                      </p>
                    </div>

                    {/* Deal Stage */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Stage</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        deal.stage === 'qualification' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        deal.stage === 'proposal' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' :
                        deal.stage === 'negotiation' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        deal.stage === 'closed-won' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {deal.stage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </div>

                    {/* Probability */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Probability</p>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${deal.probability}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{deal.probability}%</span>
                      </div>
                    </div>

                    {/* Priority */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Priority</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        deal.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        deal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {deal.priority.charAt(0).toUpperCase() + deal.priority.slice(1)}
                      </span>
                    </div>

                    {/* Due Date */}
                    {deal.dueDate && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Due Date</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(deal.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {/* Created Date */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Created</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(deal.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Updated Date */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Last Updated</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(deal.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  {deal.stage !== 'closed-won' && deal.stage !== 'closed-lost' && (
                    <>
                      <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                        <CheckCircle className="w-4 h-4 inline mr-1" /> Mark Won
                      </button>
                      <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                        <XCircle className="w-4 h-4 inline mr-1" /> Mark Lost
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Contact Person */}
              {contactData && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Primary Contact</h3>

                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {contactData.avatarSrc ? (
                          <img 
                            src={contactData.avatarSrc} 
                            alt={contactData.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <h4 className="text-base font-medium text-gray-900 dark:text-white">{contactData.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{contactData.title}</p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <a href={`mailto:${contactData.email}`} className="inline-flex items-center justify-center px-3 py-1 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800/60 transition-colors text-sm">
                        <Mail className="w-4 h-4 mr-1" />
                        Email
                      </a>
                      {contactData.phone && (
                        <a href={`tel:${contactData.phone}`} className="inline-flex items-center justify-center px-3 py-1 bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-200 rounded-md hover:bg-green-100 dark:hover:bg-green-800/60 transition-colors text-sm">
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Notes */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notes</h3>
                  <button
                    onClick={() => setEditingNotes(!editingNotes)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {editingNotes ? (
                      <>
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </>
                    )}
                  </button>
                </div>

                {editingNotes ? (
                  <div className="space-y-4">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={6}
                      placeholder="Add notes about this deal..."
                    />

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingNotes(false)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveNotes}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 min-h-[100px]">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {deal.notes || 'No notes added for this deal.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right column - Tabs */}
            <div className="md:col-span-2 flex flex-col">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-4 px-6 py-3" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        px-3 py-2 text-sm font-medium rounded-md ${
                          activeTab === tab.id 
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-800">
                {activeTab === 'summary' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deal Summary</h3>
                    
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mb-6">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                          <p className="font-medium text-gray-900 dark:text-white">{deal.contact}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                          <p className="font-medium text-gray-900 dark:text-white">{deal.company}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Value</p>
                          <p className="font-medium text-green-600 dark:text-green-400">{formatCurrency(deal.value)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Stage</p>
                          <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            deal.stage === 'qualification' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            deal.stage === 'proposal' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' :
                            deal.stage === 'negotiation' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                            deal.stage === 'closed-won' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {deal.stage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Activity Summary */}
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                          <Activity className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                          Activity
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Last activity 2 days ago</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Email sent: "Follow-up on proposal"</p>
                      </div>

                      {/* Timeline Position */}
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                          Timeline
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">In pipeline for 45 days</p>
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full mt-2">
                          <div 
                            className="h-2 bg-indigo-500 rounded-full" 
                            style={{ width: `${deal.probability}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Next Steps */}
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                          <ArrowRight className="w-4 h-4 mr-2 text-green-500 dark:text-green-400" />
                          Next Steps
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Schedule follow-up call to discuss proposal feedback</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Due in 2 days</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'communication' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Communication History</h3>
                    
                    {/* Communication log would go here */}
                    <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 divide-y divide-gray-200 dark:divide-gray-600">
                      {/* Sample communication items */}
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Email: {index === 0 ? 'Proposal Follow-up' : index === 1 ? 'Meeting Scheduled' : 'Initial Contact'}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {index === 0 ? '2 days ago' : index === 1 ? '1 week ago' : '2 weeks ago'}
                              </p>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                                {index === 0 
                                  ? 'Followed up on the proposal sent last week. Waiting for feedback.' 
                                  : index === 1 
                                  ? 'Scheduled a product demo for next Tuesday at 2 PM.' 
                                  : 'Initial outreach to discuss their software needs.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {/* Handle new communication */}}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4 inline mr-1" />
                        Add Communication
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'attachments' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documents & Attachments</h3>
                    
                    {/* Attachments would go here */}
                    <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">Uploaded Files</h4>
                        <label
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-sm font-medium cursor-pointer"
                        >
                          <Upload className="w-4 h-4 inline mr-1" />
                          Upload File
                          <input type="file" className="hidden" onChange={(e) => {/* Handle file upload */}} />
                        </label>
                      </div>
                      
                      <div className="divide-y divide-gray-200 dark:divide-gray-600">
                        {/* Sample attachments */}
                        {[
                          { name: 'Proposal.pdf', type: 'PDF', size: '2.4 MB', date: '2023-09-10' },
                          { name: 'Contract.pdf', type: 'PDF', size: '1.8 MB', date: '2023-09-05' },
                          { name: 'Requirements.docx', type: 'Word', size: '1.2 MB', date: '2023-09-01' }
                        ].map((file, index) => (
                          <div key={index} className="py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-600">
                            <div className="flex items-center">
                              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded mr-3">
                                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{file.size} • {file.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                              <button className="p-1 hover:text-gray-700">
                                <Download className="h-5 w-5" />
                              </button>
                              <button className="p-1 hover:text-red-600">
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Empty state if no files */}
                      {/* <div className="text-center py-8">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by uploading a file.</p>
                      </div> */}
                    </div>
                  </div>
                )}

                {activeTab === 'tasks' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tasks & Follow-ups</h3>
                    
                    <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                      {/* Task Form */}
                      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Add New Task</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Task Description
                            </label>
                            <input
                              type="text"
                              placeholder="E.g., Call client to discuss proposal"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Due Date
                              </label>
                              <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Priority
                              </label>
                              <select
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                              </select>
                            </div>
                          </div>
                          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-sm font-medium">
                            Add Task
                          </button>
                        </div>
                      </div>

                      {/* Tasks List */}
                      <div className="space-y-3">
                        {/* Sample tasks */}
                        <div className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded dark:bg-gray-600" />
                              <p className="ml-3 text-sm font-medium text-gray-900 dark:text-white">Follow up on proposal</p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              High
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 ml-7">Due today</p>
                        </div>

                        <div className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded dark:bg-gray-600" />
                              <p className="ml-3 text-sm font-medium text-gray-900 dark:text-white">Schedule product demo</p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              Medium
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 ml-7">Due in 3 days</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'edit' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Deal</h3>
                  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deal Information</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                            <input
                              type="text"
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value</label>
                            <input
                              type="number"
                              value={formData.value}
                              onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Advanced Options</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {formData.tags.map((tag, idx) => (
                              <span key={idx} className="inline-flex items-center bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => setFormData({ 
                                    ...formData, 
                                    tags: formData.tags.filter((_, i) => i !== idx) 
                                  })}
                                  className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && tagInput.trim()) {
                                  e.preventDefault();
                                  setFormData({
                                    ...formData,
                                    tags: [...formData.tags, tagInput.trim()]
                                  });
                                  setTagInput('');
                                }
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Add a tag"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (tagInput.trim()) {
                                  setFormData({
                                    ...formData,
                                    tags: [...formData.tags, tagInput.trim()]
                                  });
                                  setTagInput('');
                                }
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end space-x-4">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
                )}

                {activeTab === 'ai' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Insights & Analysis</h3>
                    
                    {/* AI insights content would go here */}
                    <p>AI analysis content for this deal.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3 bg-gray-50 dark:bg-gray-800">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
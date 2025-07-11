@@ .. @@
   return (
     <>
       {/* Backdrop */}
-      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={onClose}></div>
+      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={onClose}></div>
 
       {/* Modal */}
-      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
-        <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-2xl sm:rounded-xl">
+      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
+        <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-2xl sm:rounded-xl">
           {/* Header */}
-          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
-            <h2 className="text-xl font-semibold text-gray-900">Deal Details</h2>
-            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
+          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
+            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Deal Details</h2>
+            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">
               <X className="h-6 w-6" />
             </button>
           </div>
 
           {/* Content */}
-          <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(90vh-73px)]">
+          <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(90vh-73px)]">
             {/* Left column - Deal Details */}
-            <div className="p-6 overflow-y-auto border-r border-gray-200 md:col-span-1">
+            <div className="p-6 overflow-y-auto border-r border-gray-200 dark:border-gray-700 md:col-span-1">
               {/* Deal Overview */}
-              <div className="mb-6">
-                <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Overview</h3>
+              <div className="mb-6">
+                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deal Overview</h3>
 
-                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
-                  <div className="flex items-center mb-4">
+                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
+                  <div className="flex items-center mb-4">
                     <div className="flex-shrink-0">
                       <img
                         src={deal.companyAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(deal.company)}&background=3b82f6&color=ffffff&size=40`}
                         alt={deal.company}
-                        className="h-12 w-12 rounded-lg border border-gray-200"
+                        className="h-12 w-12 rounded-lg border border-gray-200 dark:border-gray-600"
                       />
                     </div>
-                    <div className="ml-4 flex-1 min-w-0">
-                      <h4 className="text-lg font-bold text-gray-900 truncate">{deal.title}</h4>
-                      <p className="text-sm text-gray-600">{deal.company}</p>
+                    <div className="ml-4 flex-1 min-w-0">
+                      <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate">{deal.title}</h4>
+                      <p className="text-sm text-gray-600 dark:text-gray-300">{deal.company}</p>
                     </div>
                   </div>
 
@@ -42,29 +42,29 @@
                   <div className="space-y-3">
                     {/* Deal Value */}
-                    <div className="flex items-center justify-between">
-                      <p className="text-sm text-gray-600">Deal Value</p>
-                      <p className="text-sm font-semibold text-green-600">
+                    <div className="flex items-center justify-between">
+                      <p className="text-sm text-gray-600 dark:text-gray-300">Deal Value</p>
+                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                         {formatCurrency(deal.value)}
                       </p>
                     </div>
 
                     {/* Deal Stage */}
-                    <div className="flex items-center justify-between">
-                      <p className="text-sm text-gray-600">Stage</p>
+                    <div className="flex items-center justify-between">
+                      <p className="text-sm text-gray-600 dark:text-gray-300">Stage</p>
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                         deal.stage === 'qualification' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                         deal.stage === 'proposal' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' :
                         deal.stage === 'negotiation' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                         deal.stage === 'closed-won' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                         'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                       }`}>
-                        {deal.stage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
+                        {deal.stage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                       </span>
                     </div>
 
                     {/* Probability */}
-                    <div className="flex items-center justify-between">
-                      <p className="text-sm text-gray-600">Probability</p>
+                    <div className="flex items-center justify-between">
+                      <p className="text-sm text-gray-600 dark:text-gray-300">Probability</p>
                       <div className="flex items-center">
                         <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                           <div
@@ -72,70 +72,70 @@
                             style={{ width: `${deal.probability}%` }}
                           ></div>
                         </div>
-                        <span className="text-sm font-medium text-gray-900">{deal.probability}%</span>
+                        <span className="text-sm font-medium text-gray-900 dark:text-white">{deal.probability}%</span>
                       </div>
                     </div>
 
                     {/* Priority */}
-                    <div className="flex items-center justify-between">
-                      <p className="text-sm text-gray-600">Priority</p>
+                    <div className="flex items-center justify-between">
+                      <p className="text-sm text-gray-600 dark:text-gray-300">Priority</p>
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                         deal.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                         deal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                         'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                       }`}>
-                        {deal.priority.charAt(0).toUpperCase() + deal.priority.slice(1)}
+                        {deal.priority.charAt(0).toUpperCase() + deal.priority.slice(1)}
                       </span>
                     </div>
 
                     {/* Due Date */}
                     {deal.dueDate && (
-                      <div className="flex items-center justify-between">
-                        <p className="text-sm text-gray-600">Due Date</p>
-                        <p className="text-sm font-medium text-gray-900">
+                      <div className="flex items-center justify-between">
+                        <p className="text-sm text-gray-600 dark:text-gray-300">Due Date</p>
+                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                           {new Date(deal.dueDate).toLocaleDateString()}
                         </p>
                       </div>
                     )}
 
                     {/* Created Date */}
-                    <div className="flex items-center justify-between">
-                      <p className="text-sm text-gray-600">Created</p>
-                      <p className="text-sm font-medium text-gray-900">
+                    <div className="flex items-center justify-between">
+                      <p className="text-sm text-gray-600 dark:text-gray-300">Created</p>
+                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                         {new Date(deal.createdAt).toLocaleDateString()}
                       </p>
                     </div>
 
                     {/* Updated Date */}
-                    <div className="flex items-center justify-between">
-                      <p className="text-sm text-gray-600">Last Updated</p>
-                      <p className="text-sm font-medium text-gray-900">
+                    <div className="flex items-center justify-between">
+                      <p className="text-sm text-gray-600 dark:text-gray-300">Last Updated</p>
+                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                         {new Date(deal.updatedAt).toLocaleDateString()}
                       </p>
                     </div>
                   </div>
                 </div>
 
-                <div className="mt-4 flex space-x-2">
+                <div className="mt-4 flex space-x-2">
                   {deal.stage !== 'closed-won' && deal.stage !== 'closed-lost' && (
                     <>
-                      <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
+                      <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                         <CheckCircle className="w-4 h-4 inline mr-1" /> Mark Won
                       </button>
-                      <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
+                      <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                         <XCircle className="w-4 h-4 inline mr-1" /> Mark Lost
                       </button>
                     </>
                   )}
                 </div>
               </div>
 
               {/* Contact Person */}
               {contactData && (
-                <div className="mb-6">
-                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Contact</h3>
+                <div className="mb-6">
+                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Primary Contact</h3>
 
-                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
+                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                     <div className="flex items-center">
-                      <div className="flex-shrink-0">
+                      <div className="flex-shrink-0">
                         {contactData.avatarSrc ? (
                           <img 
                             src={contactData.avatarSrc} 
@@ -143,26 +143,26 @@
                             className="h-10 w-10 rounded-full object-cover"
                           />
                         ) : (
-                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
+                          <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                             <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                           </div>
                         )}
                       </div>
-                      <div className="ml-3">
-                        <h4 className="text-base font-medium text-gray-900">{contactData.name}</h4>
-                        <p className="text-sm text-gray-600">{contactData.title}</p>
+                      <div className="ml-3">
+                        <h4 className="text-base font-medium text-gray-900 dark:text-white">{contactData.name}</h4>
+                        <p className="text-sm text-gray-600 dark:text-gray-300">{contactData.title}</p>
                       </div>
                     </div>
 
-                    <div className="mt-3 grid grid-cols-2 gap-2">
-                      <a href={`mailto:${contactData.email}`} className="inline-flex items-center justify-center px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm">
+                    <div className="mt-3 grid grid-cols-2 gap-2">
+                      <a href={`mailto:${contactData.email}`} className="inline-flex items-center justify-center px-3 py-1 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800/60 transition-colors text-sm">
                         <Mail className="w-4 h-4 mr-1" />
                         Email
                       </a>
                       {contactData.phone && (
-                        <a href={`tel:${contactData.phone}`} className="inline-flex items-center justify-center px-3 py-1 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors text-sm">
+                        <a href={`tel:${contactData.phone}`} className="inline-flex items-center justify-center px-3 py-1 bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-200 rounded-md hover:bg-green-100 dark:hover:bg-green-800/60 transition-colors text-sm">
                           <Phone className="w-4 h-4 mr-1" />
                           Call
                         </a>
                       )}
                     </div>
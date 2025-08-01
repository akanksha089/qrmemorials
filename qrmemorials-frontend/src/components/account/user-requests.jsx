
function userRequests({approveRequest, users}) {

  
  const toggleActive = (id) => {
    const user = users.find((u) => u.id === id);
    if (!user.active) {
      approveRequest(user.requestId);
    }
  };

  return (
    <div className="w-full dark:bg-dark-secondary p-5 sm:p-8 lg:p-[50px]">
      <h4 className="font-medium leading-none text-xl sm:text-2xl mb-5 sm:mb-6">
        User Requests
      </h4>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-dark-tertiary text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
              <th className="p-4 border border-gray-200 dark:border-gray-700">S.No.</th>
              <th className="p-4 border border-gray-200 dark:border-gray-700">Name</th>
              <th className="p-4 border border-gray-200 dark:border-gray-700">Email</th>
              <th className="p-4 border border-gray-200 dark:border-gray-700">Active</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ?
            users.map((user, idx) => (
              <tr key={user.id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="p-4 text-gray-800 dark:text-gray-200">{idx + 1}</td>
                <td className="p-4 text-gray-800 dark:text-gray-200 capitalize">{user.name}</td>
                <td className="p-4 text-gray-800 dark:text-gray-200">{user.email}</td>
                <td className="p-4">
                  {/* Switch Button */}
                  <label htmlFor={`switch-${user.id}`} className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id={`switch-${user.id}`}
                      className="sr-only peer"
                      checked={user.active}
                      onChange={() => toggleActive(user.id)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 transition-all duration-300"></div>
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transform peer-checked:translate-x-full transition-transform duration-300"></div>
                  </label>
                </td>
              </tr>
            )) : 
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500 dark:text-gray-400">
                No user requests found.
              </td>
               </tr>
           }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default userRequests
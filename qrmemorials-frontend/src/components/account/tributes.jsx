import { FaEdit, FaTrash } from "react-icons/fa";


function Tributes() {
  return (
<div className="w-full dark:bg-dark-secondary p-5 sm:p-8 lg:p-[50px]">
  <h4 className="font-medium leading-none text-xl sm:text-2xl mb-5 sm:mb-6">
    Tributes
  </h4>

 <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-dark-tertiary text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
            <th className="p-4 border font-bold border-gray-200 dark:border-gray-700">S.No.</th>
            <th className="p-4 border font-bold border-gray-200 dark:border-gray-700">Image</th>
            <th className="p-4 border font-bold border-gray-200 dark:border-gray-700">Name</th>
            <th className="p-4 border font-bold border-gray-200 dark:border-gray-700">Tribute</th>
            <th className="p-4 border font-bold border-gray-200 dark:border-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[{
            id: 1,
            name: "John Doe",
            tribute: "A kind soul who touched many lives. You will be missed.",
            image: "https://via.placeholder.com/60"
          }, {
            id: 2,
            name: "Jane Smith",
            tribute: "Forever in our hearts. Your legacy lives on.",
            image: "https://via.placeholder.com/60"
          }].map((entry, index) => (
            <tr key={entry.id} className="border-t border-gray-200 dark:border-gray-700">
              <td className="p-4 text-gray-800 dark:text-gray-200">{index + 1}</td>
              <td className="p-4">
                <img
                  src={entry.image}
                  alt={entry.name}
                  className="w-14 h-14 object-cover rounded-full"
                />
              </td>
              <td className="p-4 text-gray-800 dark:text-gray-200">{entry.name}</td>
              <td className="p-4 text-gray-600 dark:text-gray-400">{entry.tribute}</td>
              <td className="p-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => console.log("Edit", entry.id)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => console.log("Delete", entry.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
</div>

  )
}

export default Tributes
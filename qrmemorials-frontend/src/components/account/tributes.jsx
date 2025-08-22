import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditTributeModal from "./editTributeModal";

function Tributes({ tributes }) {
  const [open, setOpen] = useState(false);
  const [selectedTribute, setSelectedTribute] = useState(null);
  const [localTributes, setLocalTributes] = useState([]);

  // Sync local state when props change
  useEffect(() => {
    setLocalTributes(tributes || []);
  }, [tributes]);

  const handleUpdateTribute = (updatedTribute) => {
    setLocalTributes((prev) =>
      prev.map((t) => (t.id === updatedTribute.id ? updatedTribute : t))
    );
  };
  const openEditModal = (tribute) => {
    setSelectedTribute(tribute);
    setOpen(true);
  };

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
            {localTributes?.length > 0 ? (
              localTributes?.map((item, index) => (
                <tr key={item.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-4 text-gray-800 dark:text-gray-200">{index + 1}</td>
                  <td className="p-4">
                    <img
                      src={item?.profile_photo}
                      alt={item?.full_name}
                      className="w-14 h-14 object-cover rounded-full"
                    />
                  </td>
                  <td className="p-4 text-gray-800 dark:text-gray-200">{item?.full_name}</td>
                  <td
                    className="p-4 text-gray-600 dark:text-gray-400"
                    dangerouslySetInnerHTML={{ __html: item?.tribute_text }}
                  ></td>
                  <td className="p-4">
                    <div className="flex space-x-4">
                      <button

                        onClick={() => openEditModal(item)}
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
                  <EditTributeModal
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    tribute={selectedTribute}
                    onUpdate={handleUpdateTribute} // Pass callback

                  />
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No tributes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

  )
}

export default Tributes
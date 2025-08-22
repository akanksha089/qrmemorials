
import moment from "moment"; // for time formatting

function Tribute({ tributes }) {
  return (
    <div className="space-y-6 py-2">
      {tributes?.map((item) => (
        <div
          key={item.id}
          className="border border-gray-300 dark:border-gray-600 bg-transparent p-4 rounded-md"
        >
          {/* Image + Time */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <img
                src={item.profile_photo}
                alt={item.full_name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">{item.full_name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.relation}</p>
              </div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {moment(item.updated_at).fromNow()}
            </span>
          </div>

          {/* Memory Text */}
          {item.memory_text && (
            <p className="mb-2 text-gray-700 dark:text-gray-300">
              <strong>Memory:</strong> {item.memory_text}
            </p>
          )}

          {/* Tribute Text (as HTML) */}
          {item.tribute_text && (
            <div
              className="text-gray-800 dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: item.tribute_text }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default Tribute;

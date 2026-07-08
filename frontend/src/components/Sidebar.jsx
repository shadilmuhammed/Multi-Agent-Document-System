function Sidebar({
  documents,
  onDelete,
  onChat,
}) {
  return (
    <div className="w-72 bg-white border-r min-h-screen p-4">

      <div className="flex justify-between items-center mb-6">
  <h2 className="text-xl font-bold">
    📄 Documents
  </h2>

  <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
    {documents.length}
  </span>
</div>

      {documents.length === 0 ? (
        <div className="text-center py-8">

  <div className="text-5xl mb-3">
    📂
  </div>

  <p className="text-gray-500">
    No documents found
  </p>

</div>
      ) : (
        documents.map((doc) => (
          <div
            key={doc.id}
            className="
              bg-white
              rounded-xl
              shadow
              hover:shadow-xl
              hover:-translate-y-1
              transition-all
              duration-300
              p-4
              mb-4
            "
          >
            <p className="font-semibold break-words">
              📄 {doc.filename}
            </p>

            <div className="flex gap-2 mt-4">

              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm"
              >
                Preview
              </a>

              <button
                onClick={() => onChat(doc.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
              >
                Chat
              </button>

              <button
                onClick={() => {
                    if (window.confirm("Delete this document?")) {
                        onDelete(doc.id);
                    }
                    }}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm"
              >
                Delete
              </button>

            </div>
          </div>
        ))
      )}

    </div>
  );
}

export default Sidebar;
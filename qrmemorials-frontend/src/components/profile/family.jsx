import React from 'react'

function Family({ family }) {
  return (
    <div className="space-y-4 text-black">
      {family && family.length ? (
        family.map((member, index) => (
          <div key={index}>
            <p>
              <span className="font-semibold">{member?.relation}:</span>
              <span className="pl-1">{member?.name}</span>
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No family members found.</p>
      )}
    </div>
  )
}

export default Family
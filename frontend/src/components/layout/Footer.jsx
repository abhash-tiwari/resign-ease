import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="footer sm:footer-horizontal footer-center bg-gray-900 text-gray-200 p-4">
        <aside className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium">
            Copyright © {new Date().getFullYear()} - All rights reserved 
          </p>
        </aside>
      </footer>
    </div>
  )
}

export default Footer
export function PrimaryButton({onClick, children}: {onClick?: () => void, children: React.ReactNode}) {
  return (
    <button className="border-blue-800 border-3 bg-blue-100 color-blue-800 shadow-gray-300 shadow-md flex flex-row gap-4 px-2 py-3 font-bold justify-center hover:shadow-none hover:top-1 relative" onClick={onClick}>
      {children}
    </button>
  )
}
export function DisabledButton({children}: {onClick?: () => void, children: React.ReactNode}) {
  return (
    <button className="border-blue-100  bg-blue-50 border-3 flex flex-row gap-4 px-2 py-3 font-bold justify-center" disabled>
      {children}
    </button>
  )
}
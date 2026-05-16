export function ConstructiveBanner({children}: {children: React.ReactNode}) {
  return (
    <div className="border-green-800  bg-green-100 border-3 gap-4 p-4 text-green-800">
      {children}
    </div>
  )
}
export function DestructiveBanner({children}: {children: React.ReactNode}) {
  return (
     <div className="border-red-800  bg-red-100 border-3 gap-4 p-4 text-red-800">
      {children}
    </div>
  )
}
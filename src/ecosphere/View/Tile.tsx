export function Tile({ children, title }: { children?: React.ReactNode; title: string; }) {
  return <div className='Tile' title={title}>
    <h5 className='Title'>{title}</h5>
    {children}
  </div>;
}

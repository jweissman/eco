import './App.css';
import Model from './ecosphere/Model';

type ApplicationProps = { model: Model }
function App({ model }: ApplicationProps) {
  const { inventory, individuals } = model;
  const items = Object.entries(inventory.storage).map(([elementId, amount]) => {
    // console.log("Consider element with id " + elementId);
    const element = model.lookupElementById(Number(elementId))
    return { ...element, amount }
  })

  return (
    <div className="App">
      <span>
        <b>MODEL:</b>
        {model.name}
      </span>

      <b>ITEMS:</b>
      <ul>
        {items.map(({name, amount}) => <li key={name}>{name}: {amount}</li>)}
      </ul>

      <b>INDIVIDUALS:</b>
      <ul>
        {individuals.map(({ name }) => <li key={name}>{name}</li>)}
      </ul>
    </div>
  );
}

export default App;

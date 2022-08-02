import './Popup.css'

function Popup(props) {
  if(props.trigger === true) {
    <div id={props.id} className="popup">
      {props.children}
    </div>
  } else return;
}

export default Popup;
import NavBar from "./NavBar";
const EditDelete = () => {
  return (
    <div>
      <h2>Edit & Delete</h2>
      <ul>
        <li>Delete button to delete diory</li>
        <ul>
          <li>Confirm delete and show its consequences</li>
          <li>Checkbox: Delete also all linked diories</li>
        </ul>
        <li>Edit name (input field all the time visible?</li>
        <li>Delete links to linked diories</li>
        <li>Change background image (needs one more DioryGrid?)</li>
        <li>Change type</li>
        <li>Change date</li>
        <li>Change location</li>
        <li>
          Save button sends saveDiograph request and redirects back to DioryGrid
        </li>
      </ul>
    </div>
  );
};

export default EditDelete;

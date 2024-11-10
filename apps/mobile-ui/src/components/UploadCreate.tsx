import NavBar from "./NavBar";

const UploadCreate = () => {
  return (
    <div>
      <NavBar />
      <h2>Upload & Create</h2>
      <ul>
        <li>
          Create diory linked to diory in focus
          <ul>
            <li>Checkbox to create without linking</li>
          </ul>
        </li>
        <li></li>
        <li>Upload image or drag&drop file (triggers file-generator)</li>
        <li></li>
      </ul>
    </div>
  );
};

export default UploadCreate;

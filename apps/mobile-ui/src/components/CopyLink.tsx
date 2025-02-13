import { useNavigate } from "react-router-dom";
import { useRoomContext } from "../contexts/RoomContext";
import CopyTestForm from "./CopyTestForm";

const CopyLink = () => {
  const navigate = useNavigate();

  const handleCopyResponse = (data: any) => {
    // alert(JSON.stringify(data));
    navigate("/home");
  };

  return (
    <div>
      <CopyTestForm onResponse={handleCopyResponse} />
    </div>
  );
};

export default CopyLink;

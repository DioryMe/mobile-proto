import { useNavigate } from "react-router-dom";
import CopyTestForm from "./CopyTestForm";

const CopyLink = () => {
  const navigate = useNavigate();

  const handleCopyResponse = (data: any) => {
    // alert(JSON.stringify(data));
    navigate("/my-diory");
  };

  return (
    <div>
      <CopyTestForm onResponse={handleCopyResponse} />
    </div>
  );
};

export default CopyLink;

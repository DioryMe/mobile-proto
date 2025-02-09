import { useState } from "react";
import { fetchData } from "./hooks/useFetchData";
import CopyTestForm from "./components/copyTestForm";

const EndpointTestPage = () => {
  const [responses, setResponses] = useState<Record<string, any>>({
    "/room/native/init": null,
    "/room/native/diograph": null,
    "/room/demo/diograph": null,
    "/room/thumbnail": null,
    "/room/content": null,
    "/room/list": null,
    "/copy": null,
  });

  const handleApiRequest = async (postfix: string) => {
    fetchData(postfix).then((data) =>
      setResponses((prev) => ({ ...prev, [postfix]: data }))
    );
  };

  const handleCopyResponse = (data: any) => {
    setResponses((prev) => ({ ...prev, "/copy": data }));
  };

  return (
    <div>
      <h1>Hello World</h1>
      {Object.entries(responses).map(([key, value]) => (
        <div key={key}>
          {key}: {value ? "OK" : "-"}
        </div>
      ))}
      <button
        key="nativeDiographInitButton"
        data-test-id="nativeDiographInitButton"
        onClick={() => handleApiRequest("/room/native/init")}
      >
        Init Diograph
      </button>
      <button
        key="nativeDiographButton"
        data-test-id="nativeDiographButton"
        onClick={() => handleApiRequest("/room/native/diograph")}
      >
        Native Diograph
      </button>
      <button
        key="demoDiographButton"
        data-test-id="demoDiographButton"
        onClick={() => handleApiRequest("/room/demo/diograph")}
      >
        Demo Diograph
      </button>
      <br />
      <button
        key="thumbnailButton"
        data-test-id="thumbnailButton"
        onClick={() => handleApiRequest("/room/thumbnail")}
      >
        Thumbnail
      </button>
      <button
        key="contentButton"
        data-test-id="contentButton"
        onClick={() => handleApiRequest("/room/content")}
      >
        Content
      </button>
      <button
        key="listButton"
        data-test-id="listButton"
        onClick={() => handleApiRequest("/room/list")}
      >
        List
      </button>
      <CopyTestForm onResponse={handleCopyResponse} />
    </div>
  );
};

export default EndpointTestPage;

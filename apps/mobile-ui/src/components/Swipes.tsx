// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDiosphereContext } from "../contexts/DiosphereContext";

import "./swipes-styles.css";
import { useEffect, useState } from "react";

const Swipes = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const roomId = pathname.startsWith("/my-diory")
    ? "myDioryRoom"
    : "browseRoom";

  const {
    [roomId]: { diograph, next, prev, focusId, focus: focusDiory, setFocusId },
  } = useDiosphereContext();

  const [slides, setSlides] = useState<any>([]);

  const backToGrid = () => {
    navigate(`/${roomId == "myDioryRoom" ? "my-diory" : "browse"}/${focusId}`);
  };

  const loadSlides = () => {
    if (diograph && focusDiory && focusDiory.image) {
      setSlides([]);
      if (prev) {
        setSlides([
          <SwiperSlide key={prev}>
            <img
              src={diograph.getDiory({ id: prev }).image}
              onClick={backToGrid}
            />
          </SwiperSlide>,
        ]);
      }

      setSlides((prevSlides: any) => [
        ...prevSlides,
        <SwiperSlide key={focusId}>
          <img src={focusDiory.image || ""} onClick={backToGrid} />
        </SwiperSlide>,
      ]);

      if (next) {
        setSlides((prevSlides: any) => [
          ...prevSlides,
          <SwiperSlide key={next}>
            <img
              src={diograph.getDiory({ id: next }).image}
              onClick={backToGrid}
            />
          </SwiperSlide>,
        ]);
      }
    }
  };

  useEffect(() => {
    loadSlides();
  }, [diograph]);

  console.log("slides", slides);
  return (
    diograph &&
    focusDiory &&
    focusDiory.image && (
      <>
        <Swiper
          className="mySwiper"
          // onSlidePrevTransitionStart={(swiper) => {
          //   setFocusId && prev && setFocusId(prev);
          //   navigate(
          //     `/${roomId == "myDioryRoom" ? "my-diory" : "browse"}/${prev}/content`
          //   );
          // }}
          // onSlideNextTransitionStart={(swiper) => {
          //   setFocusId && next && setFocusId(next);
          //   navigate(
          //     `/${roomId == "myDioryRoom" ? "my-diory" : "browse"}/${next}/content`
          //   );
          // }}
          // onReachBeginning={(swiper) => {
          //   console.log("addprev", prev);
          //   if (prev) {
          //     setSlides((prevSlides: any) => [
          //       <SwiperSlide key={prev}>
          //         <img src={diograph.getDiory({ id: prev }).image} />
          //       </SwiperSlide>,
          //       ...prevSlides,
          //     ]);
          //   }
          // }}
          // onReachEnd={(swiper) => {
          //   console.log("123", swiper.activeIndex);
          //   if (next) {
          //     console.log("addnext", next);
          //     setSlides((prevSlides: any) => [
          //       ...prevSlides,
          //       <SwiperSlide key={prev}>
          //         <img src={diograph.getDiory({ id: next }).image} />
          //       </SwiperSlide>,
          //     ]);
          //   }
          // }}
          initialSlide={prev ? 1 : 0}
        >
          {slides.map((slide: any) => slide)}
        </Swiper>
      </>
    )
  );
};

export default Swipes;

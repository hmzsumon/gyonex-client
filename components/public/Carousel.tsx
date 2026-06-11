"use client";
import { Component } from "react";

// Use require for compatibility with class components
const Slider = require("react-slick").default;

export default class SimpleSlider extends Component {
  render() {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      autoplay: true,
      autoplaySpeed: 4000,
    };

    const sliderItems = [
      "/banners/banner_01.png",
      "/banners/banner_02.png",
      "/banners/banner_03.png",
      "/banners/banner_04.png",
      "/banners/banner_05.png",
      "/banners/banner_06.png",
    ];

    return (
      <div className="w-full mx-auto">
        <Slider {...settings}>
          {sliderItems.map((item, index) => (
            <div className="px-1" key={index}>
              <img
                src={item}
                alt=""
                className="w-full rounded-xl min-h-[120px]"
              />
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}

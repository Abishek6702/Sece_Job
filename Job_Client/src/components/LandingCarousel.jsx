import React from 'react';
import Image1 from '../assets/hero3.jpeg';
import Image2 from '../assets/hero4.jpeg';
import Image3 from '../assets/hero5.jpeg';
import Image4 from '../assets/hero6.jpeg';
import Image5 from '../assets/hero7.jpeg';

export default function LandingCarousel() {
  return (
    <div className='company flex flex-row items-center w-[90%] md:w-[100%] h-[150px]  overflow-hidden relative m-auto bottom-20  rounded-2xl  mt-18 '>
      <div className='image flex flex-row gap-15'>
        <img className='w-[150px] h-[40px]' src={Image1} alt='img1'/>
        <img className='w-[150px] h-[40px]' src={Image2} alt='img2'/>
        <img className='w-[150px] h-[40px]' src={Image3} alt='img3'/>
        <img className='w-[150px] h-[40px]' src={Image4} alt='img4'/>
        <img className='w-[150px] h-[40px]' src={Image5} alt='img5'/>
        <img className='w-[150px] h-[40px]' src={Image1} alt='img6'/>
        <img className='w-[150px] h-[40px]' src={Image2} alt='img7'/>
        <img className='w-[150px] h-[40px]' src={Image3} alt='img8'/>
        <img className='w-[150px] h-[40px]' src={Image4} alt='img9'/>
        <img className='w-[150px] h-[40px]' src={Image5} alt='img10'/>
      </div>
    </div>
  );
}
function showBg(){let e=document.querySelector("body"),t=document.querySelectorAll(".projects ul li"),o=document.querySelector(".projects");t.forEach((t,n)=>{t.addEventListener("mouseover",()=>{var t;e.style.backgroundImage=`url('assets/landing-page-bgs/bg_${t=n,["pokemon","fifa","fortnite","lotr","lego","magic"][t]}.jpg')`,e.style.backgroundSize="cover",e.style.backgroundPosition="center",e.style.backgroundRepeat="no-repeat",e.style.width="100%",e.style.height="100vh",o.style.transition="opacity 2s ease-in-out",o.style.opacity="0.5"}),t.addEventListener("mouseout",()=>{e.style.backgroundImage="none",o.style.backgroundColor="#f3f2b3",o.style.transition="opacity 0.3s ease-in-out",o.style.opacity="1"})})}function checkScreenSize(){window.innerWidth>=1400&&showBg()}window.onload=checkScreenSize,window.addEventListener("resize",checkScreenSize);
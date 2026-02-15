import gsap from "gsap";

type TweenLike = gsap.core.Tween | gsap.core.Timeline;

export const serial = (...tweens: TweenLike[]) => {
  const tl = gsap.timeline();
  for (const tween of tweens) {
    tl.add(tween);
  }
  return tl;
};

export const parallel = (...tweens: TweenLike[]) => {
  return gsap.timeline().add(tweens);
};

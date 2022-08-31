export const handleDragEvent = (e, dragFunc) => {
  dragFunc(e);
  document.onselectstart = () => false;
  document.ondragstart = () => false;
  document.addEventListener("mousemove", dragFunc);
  const up = () => {
    document.ondragstart = () => true;
    document.onselectstart = () => true;
    document.removeEventListener("mousemove", dragFunc);
    document.removeEventListener("mouseup", up);
  };
  document.addEventListener("mouseup", up);
};

// Imports
// =======================================================
import { useEffect, useState } from "react";
import { X } from 'react-feather';
import Heading from "../../components/Heading";
import Text from "../../components/Text";
import Button from '../../components/Button';

// Main component
// ========================================================
const Modal: React.FC<{ title?: string; description?: string; onClose: () => void, isVisible: boolean; isCloseEnabled?: boolean; }> = ({ title, description, onClose, isVisible, isCloseEnabled = true, children }) => {
  // State / Props
  const [isHidden, setIsHidden] = useState(true);
  const [isShown, setIsShown] = useState(false);

  // Functions
  /**
   * 
   */
  const onClickClose = () => {
    if (!isCloseEnabled) return;
    setIsHidden(true);
  };

  // Hooks
  /**
   * 
   */
  useEffect(() => {
    if (!isVisible && isShown) {
      setIsHidden(true);
      setTimeout(() => {
        setIsShown(false);
      }, 100);
      return;
    }

    if (!isVisible) return;

    setIsShown(true);
    setTimeout(() => {
      setIsHidden(false);
    }, 100);
  }, [isVisible]);

  /**
   * 
   */
  useEffect(() => {
    if (!isHidden) return;

    setTimeout(() => {
      setIsShown(false);
      onClose();
    }, 300);
  }, [isHidden]);

  // Render
  /**
   * 
   */
  if (!isShown) return null;

  /**
   * 
   */
  return <div className={`bg-slate-900 ${isHidden ? 'bg-opacity-0 ' : 'bg-opacity-40'} transition-color ease-in-out duration-200 fixed inset-0`}>
    <div onClick={onClickClose} className="bg-slate-900 bg-opacity-0 transition-colors ease-in-out duration-200 absolute left-0 top-0 bottom-0 block w-full"></div>
    <div className={`${isHidden ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'} transition-all ease-in-out duration-300 bg-white absolute block top-0 bottom-0 right-0 left-0 md:left-auto w-full md:max-w-xl shadow-md`}>
      <Button onClick={onClickClose} padding="none" className={`${isHidden || !isCloseEnabled ? 'hidden' : ''} absolute top-8 right-8 lg:right-auto lg:top-4 lg:-left-16 px-3`}><X /></Button>
      <div className="top-0 bottom-0 right-0 h-screen overflow-scroll">
        {title || description ? <div className="pt-10 px-8 border-b border-slate-200 mb-8">
          <Heading as="h3">{title}</Heading>
          <Text className="mb-8">{description}</Text>
        </div> : null}
        <div className="pb-10 px-8">
          {children}
        </div>
      </div>
    </div>
  </div>;
};

// Imports
// ========================================================
export default Modal;
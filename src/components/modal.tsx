import { ReactNode } from 'react';
import { GrFormClose } from 'react-icons/gr';

type ModalType = {
  isOpen: boolean;
  children: ReactNode;
  closeButtonIco: ReactNode;
};

export default function Modal(props: ModalType): JSX.Element {
  return props.isOpen ? (
    <div className="modal">
      <div className="modalContainer container">
        <div className="modalHeader">
          <div className="title">Settings</div>
          <div className="modalCloseIco ">{props.closeButtonIco}</div>
        </div>
        <div className="modalContent">{props.children}</div>
      </div>
    </div>
  ) : (
    <></>
  );
}

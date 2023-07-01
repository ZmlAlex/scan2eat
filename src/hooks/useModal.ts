import React from "react";

const useModal = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  function toggleModal() {
    setIsModalOpen(!isModalOpen);
  }

  return {
    isModalOpen,
    toggleModal,
  };
};

export default useModal;

import React from "react";

export const useModal = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  function toggleModal() {
    setIsModalOpen(!isModalOpen);
  }

  return {
    isModalOpen,
    toggleModal,
  };
};

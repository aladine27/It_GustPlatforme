import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { toast } from "react-toastify";
import { StyledButton } from "../../style/style";

import PendingRequests from "./PendingRequests";
import TypeCongeFormModal from "../../components/Conge/TypeCongeFormModal";
import CongeDetailModal from "../../components/Conge/CongeDetailDemandeModal";
import WhoIsOnLeave from "./WhoisOnLeave";
import { useTranslation } from "react-i18next";
import {
  fetchAllLeaves,
  updateLeave,
  fetchAllLeaveTypes,
  createLeaveType,
  deleteLeaveType,
  updateLeaveType
} from "../../redux/actions/LeaveAction";
import { clearLeaveTypeMessages } from "../../redux/slices/leaveSlice";


const Conge = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { leaves } = useSelector((state) => state.leave);
  const { leaveTypes } = useSelector((state) => state.leaveType);
  

  // Etat UI
  const [selectedType, setSelectedType] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  // Détail d'une demande
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  // Fetch au mount + après toute modification
  useEffect(() => {
    console.log("[Conge] useEffect []: fetchAllLeaves, fetchAllLeaveTypes");
    dispatch(fetchAllLeaves());
    dispatch(fetchAllLeaveTypes());

console.log("[Composant] leaveTypes du state redux:", leaveTypes);

  }, [dispatch]);

  // Rafraîchit les types à chaque ouverture de modal type
  useEffect(() => {
    if (modalOpen) {
      console.log("[Conge] Modal open → fetchAllLeaveTypes()");
      dispatch(fetchAllLeaveTypes());

console.log("[Composant] leaveTypes du state redux:", leaveTypes);

    }
  }, [modalOpen, dispatch]);

  // Pending = demandes en attente
  const pendingRequests = leaves.filter((l) => l.status === "pending");
  console.log("[Conge] leaves:", leaves);
  console.log("[Conge] leaveTypes:", leaveTypes);

  // Handler CRUD Type de congé
  const handleCreateType = async ({ name, limitDuration }) => {
    console.log("[Conge] handleCreateType", { name, limitDuration });
    try {
      await dispatch(createLeaveType({ name, limitDuration })).unwrap();
      toast.success(t("Type créé avec succès !"));
      dispatch(fetchAllLeaveTypes());
    } catch (err) {
      console.log("[Conge] Erreur création type", err);
      toast.error(err?.toString() || t("Erreur lors de la création du type"));
    }
  };

  const handleDeleteType = async (typeId) => {
    console.log("[Conge] handleDeleteType", typeId);
    try {
      await dispatch(deleteLeaveType(typeId)).unwrap();
      toast.success(t("Type supprimé !"));
      dispatch(fetchAllLeaveTypes());
    } catch (err) {
      console.log("[Conge] Erreur suppression type", err);
      toast.error(err?.toString() || t("Erreur lors de la suppression du type"));
    }
  };

  const handleEditType = async (typeId, updateData) => {
    console.log("[Conge] handleEditType", typeId, updateData);
    try {
      await dispatch(updateLeaveType({ id: typeId, updateData })).unwrap();
      toast.success(t("Type modifié !"));
      dispatch(fetchAllLeaveTypes());
    } catch (err) {
      console.log("[Conge] Erreur modification type", err);
      toast.error(err?.toString() || t("Erreur lors de la modification du type"));
    }
  };

  // Reset modal + messages Redux lors de fermeture
  const handleCloseModal = () => {
    console.log("[Conge] handleCloseModal");
    setModalOpen(false);
    dispatch(clearLeaveTypeMessages());
  };

  // Modal détail demande
  const handleOpenDetail = (leave) => {
    console.log("[Conge] handleOpenDetail", leave);
    setSelectedLeave(leave);
    setDetailModalOpen(true);
  };
  const handleCloseDetail = () => {
    console.log("[Conge] handleCloseDetail");
    setSelectedLeave(null);
    setDetailModalOpen(false);
  };

  // Actions Accepter/Refuser sur demande de congé
  const handleApprove = async (id) => {
    console.log("[Conge] handleApprove", id);
    try {
      await dispatch(updateLeave({ id, updateData: { status: "approved" } })).unwrap();
      toast.success(t("Demande approuvée !"));
      handleCloseDetail();
      dispatch(fetchAllLeaves());
    } catch (err) {
      console.log("[Conge] Erreur approve", err);
      toast.error(t("Erreur") + " : " + err);
    }
  };
  const handleReject = async (id) => {
    console.log("[Conge] handleReject", id);
    try {
      await dispatch(updateLeave({ id, updateData: { status: "rejected" } })).unwrap();
      toast.success(t("Demande refusée !"));
      handleCloseDetail();
      dispatch(fetchAllLeaves());
    } catch (err) {
      console.log("[Conge] Erreur reject", err);
      toast.error(t("Erreur") + " : " + err);
    }
  };

  return (
    <div style={{ background: "#f6f8fa", minHeight: "100vh", padding: "24px 12px" }}>
      {/* bouton Ajouter type */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
        <StyledButton
          startIcon={<AddCircleOutlineIcon />}
          variant="contained"
          onClick={() => {
            console.log("[Conge] Open modal type");
            setModalOpen(true);
          }}
        >
          {t("Ajouter un nouveau type")}
        </StyledButton>
      </div>

      {/* Section Who's on leave */}
      <WhoIsOnLeave
        leaves={leaves}
        leaveTypes={leaveTypes}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />

      {/* Section Pending Requests */}
      <PendingRequests
        pendingRequests={pendingRequests}
        onDetail={handleOpenDetail}
      />

      {/* Modal Type de congé */}
      <TypeCongeFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        typesConge={leaveTypes}
        onCreate={handleCreateType}
        onDeleteType={handleDeleteType}
        onEditType={handleEditType}
      />

      {/* Modal détail demande */}
      <CongeDetailModal
        open={detailModalOpen}
        handleClose={handleCloseDetail}
        leave={selectedLeave}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default Conge;

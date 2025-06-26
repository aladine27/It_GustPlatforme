import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { toast } from "react-toastify";
import {StyledButton} from "../../style/style";
import WhoIsOnLeave from "./WhoisOnleave";
import PendingRequests from "./PendingRequests";
import TypeCongeFormModal from "../../components/Conge/TypeCongeFormModal";
import CongeDetailModal from "../../components/Conge/CongeDetailDemandeModal";
import {
  fetchAllLeaves,
  updateLeave,
  fetchAllLeaveTypes,
  createLeaveType,
  deleteLeaveType,
  updateLeaveType
} from "../../redux/actions/LeaveAction";


// **Nouveaux composants découpés**


const Conge = () => {
  const dispatch = useDispatch();
  const { leaves } = useSelector((state) => state.leave);
  const { leaveTypes } = useSelector((state) => state.leaveType);

  // State pour type de filtre
  const [selectedType, setSelectedType] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  // Modals détails
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  useEffect(() => {
    dispatch(fetchAllLeaves());
    dispatch(fetchAllLeaveTypes());
  }, [dispatch]);

  // Séparation logic
  const pendingRequests = leaves.filter((l) => l.status === "pending");

  // CRUD Type de congé
  const handleCreateType = async (typeName) => {
    try {
      await dispatch(createLeaveType({ name: typeName })).unwrap();
      toast.success("Type créé !");
      dispatch(fetchAllLeaveTypes());
    } catch (err) {
      toast.error(err?.toString() || "Erreur création type !");
    }
  };
  const handleDeleteType = async (typeId) => {
    try {
      await dispatch(deleteLeaveType(typeId)).unwrap();
      toast.success("Type supprimé !");
      dispatch(fetchAllLeaveTypes());
    } catch (err) {
      toast.error(err?.toString() || "Erreur suppression type !");
    }
  };
  const handleEditType = async (typeId, newName) => {
    try {
      await dispatch(updateLeaveType({ id: typeId, updateData: { name: newName } })).unwrap();
      toast.success("Type modifié !");
      dispatch(fetchAllLeaveTypes());
    } catch (err) {
      toast.error(err?.toString() || "Erreur modification type !");
    }
  };

  // Modal détail leave
  const handleOpenDetail = (leave) => {
    setSelectedLeave(leave);
    setDetailModalOpen(true);
  };
  const handleCloseDetail = () => {
    setSelectedLeave(null);
    setDetailModalOpen(false);
  };

  // Actions Accepter/Refuser
  const handleApprove = async (id) => {
    try {
      await dispatch(updateLeave({ id, updateData: { status: "approved" } })).unwrap();
      toast.success("Demande approuvée !");
      handleCloseDetail();
      dispatch(fetchAllLeaves());
    } catch (err) {
      toast.error("Erreur : " + err);
    }
  };
  const handleReject = async (id) => {
    try {
      await dispatch(updateLeave({ id, updateData: { status: "rejected" } })).unwrap();
      toast.success("Demande refusée !");
      handleCloseDetail();
      dispatch(fetchAllLeaves());
    } catch (err) {
      toast.error("Erreur : " + err);
    }
  };

  return (
    <div style={{ background: "#f6f8fa", minHeight: "100vh", padding: "24px 12px" }}>
      {/* bouton Ajouter type */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
        <StyledButton
          startIcon={<AddCircleOutlineIcon />}
          variant="contained"
          onClick={() => setModalOpen(true)}
        >
          Ajouter un nouveau type
        </StyledButton>
      </div>

      {/* Section WHO IS ON LEAVE */}
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
        onClose={() => setModalOpen(false)}
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

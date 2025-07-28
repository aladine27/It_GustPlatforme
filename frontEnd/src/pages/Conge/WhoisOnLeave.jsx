import React, { useState, useEffect } from "react";
import {
  Box, Typography, Select, MenuItem, Chip, CardContent,
  Card,
  Grid
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GroupsIcon from '@mui/icons-material/Groups';
import { StyledButton, StyledCard } from "../../style/style";
import PaginationComponent from "../../components/Global/PaginationComponent";
import CongeCard from "./EmployeEnConge";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createLeaveType, fetchAllLeaves, fetchAllLeaveTypes, updateLeaveType } from "../../redux/actions/LeaveAction";
import TypeCongeFormModal from "../../components/Conge/TypeCongeFormModal";
export default function WhoIsOnLeave({
  leaves,
  leaveTypes,
  selectedType,
  setSelectedType,
}) {
  const { t } = useTranslation();
  const today = new Date();
  const dispatch = useDispatch();
  today.setHours(0, 0, 0, 0);
  const filteredLeaves =
    selectedType === "all"
      ? leaves.filter((l) => {
          const start = new Date(l.startDate);
          const end = new Date(l.endDate);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          return l.status === "approved" && start <= today && end >= today;
        })
      : leaves.filter((l) => {
          const start = new Date(l.startDate);
          const end = new Date(l.endDate);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          return (
            l.status === "approved" &&
            (l.leaveType?._id === selectedType || l.leaveType === selectedType) &&
            start <= today &&
            end >= today
          );
        });
          const [modalOpen, setModalOpen] = useState(false);
            const handleCloseModal = () => {
              console.log("[Conge] handleCloseModal");
              setModalOpen(false);
              dispatch(clearLeaveTypeMessages());
            };
           useEffect(() => {
              if (modalOpen) {
                console.log("[Conge] Modal open → fetchAllLeaveTypes()");
                dispatch(fetchAllLeaveTypes());
          console.log("[Composant] leaveTypes du state redux:", leaveTypes);
              }
            }, [modalOpen, dispatch]);
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const paginatedLeaves = filteredLeaves.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  useEffect(() => {
    setPage(1);
  }, [selectedType]);
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
return (
<Box sx={{ width: "100%" }}>
      <Grid sx={{display:"flex",flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
      
             {/* --- Titre custom --- */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          py: 1.2,
          pl: 1,
        }}>
          <GroupsIcon sx={{
            color: '#1976D2',
            fontSize: 38,
            mb: 0.2,
            filter: "drop-shadow(0 2px 6px #2ED47A44)"
          }} />
          <Typography
            variant="h4"
            sx={{
             color: '#1976D2',
              fontWeight: 300,
            fontSize: { xs: "2rem", md: "2.3rem" },}}
          >{t("Who's on leave?")}</Typography>
        </Box>
        {/* Filtre par type */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Box sx={{ minWidth: 240, maxWidth: 340 }}>
          <Select
            size="small"
              fullWidth
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              variant="outlined"
            sx={{borderRadius: 3,
  fontWeight: 700,
  minHeight: 36, }}
              MenuProps={{ PaperProps: { sx:{maxHeight: 320 } } }}
            ><MenuItem value="all">
              {t("All")}
              </MenuItem>
              {leaveTypes.map((type) => (
                <MenuItem key={type._id} value={type._id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      
          {/* bouton Ajouter type */}
      <Box style={{ display: "flex", justifyContent: "flex-end" }}>
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
      </Box>
      </Grid>
      <Card
        sx={{
          p: { xs: 2, md: 1 },
          borderRadius: 3,
          width: "95%",
        }}
      >{/* Liste des employés en congé */}
        <CardContent >
          {paginatedLeaves.length > 0 ? (
            paginatedLeaves.map((person, i) => (
              <React.Fragment key={person._id}>
                <CongeCard person={person} />
              </React.Fragment>
            ))
          ) : (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center", pt: 5 }}
            >
              {t("No leave found for this type.")}
            </Typography>
          )}
        </CardContent>
{/* Pagination */}
        <PaginationComponent
          count={Math.ceil(filteredLeaves.length / pageSize)}
          page={page}
          onChange={(_, value) => setPage(value)}
        />
      </Card>
      
      
       {/* Modal Type de congé */}
          <TypeCongeFormModal
            open={modalOpen}
            onClose={handleCloseModal}
            typesConge={leaveTypes}
            onCreate={handleCreateType}
            onDeleteType={handleDeleteType}
            onEditType={handleEditType}
          />
    </Box>
    
  );
}
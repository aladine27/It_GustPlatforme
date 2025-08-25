import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ileave } from './interfaces/Ileave.interface';
import { IleaveType } from 'src/leave-type/interfaces/leaveType.interface';
import { IUser } from 'src/users/interfaces/user.interface';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class LeaveService {
  constructor(@InjectModel('leaves') private leaveModel: Model<Ileave>
,  @InjectModel('leaveTypes') private leaveTypeModel: Model<IleaveType>,
   @InjectModel('users') private userModel: Model<IUser>,
   private readonly notificationService: NotificationService,

) {}
 async create(createLeaveDto: CreateLeaveDto): Promise<Ileave> {
  const newLeave = new this.leaveModel(createLeaveDto);

  await this.userModel.updateOne(
    { _id: createLeaveDto.user },
    { $push: { leaves: newLeave._id } }
  );
  await this.leaveTypeModel.updateOne(
    { _id: createLeaveDto.leaveType },
    { $push: { leaves: newLeave._id } }
  );

  const saved = await newLeave.save();

  // -> approbateurs (Admin/Rh/Manager)
  const approvers = await this.userModel.find(
    { role: { $in: ['Rh', 'Manager', 'Admin'] } },
    { _id: 1 }
  );
  // Transforme en tableau d’IDs (string) et enlève le demandeur (il ne doit pas s’auto-notifier)
  const approverIds = approvers
    .map(u => String(u._id))
    .filter(id => id !== String(createLeaveDto.user));
  //Si des approbateurs existent → envoie une notif temps réel à chacun
  if (approverIds.length) {
    this.notificationService.sendNotifToUsers(
      approverIds,
      'Nouvelle demande de congé',
      `${saved.title} a été soumis`
    );
  }
  return saved;
}

  async findLeaveByUserId(user: string):Promise<Ileave[]> {
    const leaveUser = await this.leaveModel.find({user}).populate('user')
  
      return leaveUser;
    }
   
  async findAll(): Promise<Ileave[]> {
    const leaves = await this.leaveModel.find().populate('user').populate('leaveType');
 
    return leaves;
    
  }

  async findOne(id: string):Promise<Ileave> {
    const leave = await this.leaveModel.findById(id).populate('user').populate('leaveType');
    if (!leave) {
      throw new NotFoundException('No leave found');
    }
    return leave;
  }

 async update(id: string, updateLeaveDto: UpdateLeaveDto): Promise<Ileave> {
  //Ici, on ne récupère que les champs :status user title et on ignore tout le reste (reason, duration, leaveType, createdAt, etc.).
  const before = await this.leaveModel.findById(id).select('status user title');
  if (!before) throw new NotFoundException('No leave found');

  // 2. Met à jour le congé et récupère la nouvelle version (new:true)
  const leave = await this.leaveModel.findByIdAndUpdate(id, updateLeaveDto, { new: true });
  if (!leave) throw new NotFoundException('No leave found');

  // 3. Compare l’ancien statut et le nouveau
  const prev = String((before as any).status);      // statut avant (pending, approved, rejected…)
  const next = String((leave as any).status);      // statut après update
  const requesterId = String((leave as any).user); // ID du demandeur

  // 4. Si le statut a changé → on notifie le demandeur
  if (updateLeaveDto?.status && prev !== next) {
    if (next === 'approved') {
      // 4.1 Congé approuvé
      this.notificationService.sendNotifToUser(
        requesterId,
        'Demande de congé approuvée',
        `Votre demande "${leave.title}" a été approuvée`
      );
    } else if (next === 'rejected') {
      // 4.2 Congé rejeté
      this.notificationService.sendNotifToUser(
        requesterId,
        'Demande de congé refusée',
        `Votre demande "${leave.title}" a été refusée`
      );
    } else {
      // 4.3 Autre changement de statut (ex: annulé, en révision…)
      this.notificationService.sendNotifToUser(
        requesterId,
        'Demande mise à jour',
        `Le statut de "${leave.title}" est maintenant : ${next}`
      );
    }
  }

  // 5. Retourne la nouvelle version du congé au contrôleur
  return leave;
}


  async remove(id: string) {
    const leave = await this.leaveModel.findByIdAndDelete(id);
    if (!leave) {
      throw new NotFoundException('No leave found');
    }
     await this.userModel.updateOne({_id:leave.user},{$push:{leaves:leave._id}})
    await this.leaveTypeModel.updateOne({ _id: leave.leaveType }, { $push: { leaves: leave._id } });
    return leave;
  }
  async getLeaveBalanceForUser(userId: string): Promise<{ soldeInitial: number; soldeRestant: number }> {
    const soldeInitial = 30; 

    // 1. Récupère les types de congé qui N'ONT PAS de limitDuration
    const typesSansLimite = await this.leaveTypeModel.find({
      $or: [
        { limitDuration: { $exists: false } },
        { limitDuration: null },
        { limitDuration: "" },
      ],
    });

   
    const typeIds = typesSansLimite.map(type => type._id);

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), 0, 1); // 1er janvier
    const lastDay = new Date(now.getFullYear(), 11, 31); // 31 décembre

    const leaves = await this.leaveModel.find({
      user: userId,
      status: "approved",
      leaveType: { $in: typeIds },
      startDate: { $gte: firstDay, $lte: lastDay },
    });

    // 3. Additionne la durée totale prise
    let totalPris = 0;
    leaves.forEach(l => {
      totalPris += parseInt(l.duration, 10) || 0;
    });

    let soldeRestant = soldeInitial - totalPris;
    if (soldeRestant < 0) soldeRestant = 0;

    return {
      soldeInitial,
      soldeRestant,
    };
  }

}

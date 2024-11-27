import { Order } from "@/types";
import { Progress } from "./ui/progress";
import { ORDER_STATUS } from "@/config/order-status-config";
import { CheckCircle2, Users } from "lucide-react";

type Props = {
  order: Order;
};

const OrderStatusHeader = ({ order }: Props) => {
  const getExpectedDelivery = () => {
    const created = new Date(order.createdAt);
    created.setMinutes(
      created.getMinutes() + order.restaurant.estimatedDeliveryTime
    );
    const hours = created.getHours();
    const minutes = created.getMinutes();
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${paddedMinutes}`;
  };

  const getOrderStatusInfo = () => {
    return (
      ORDER_STATUS.find((o) => o.value === order.status) || ORDER_STATUS[0]
    );
  };

  const renderPaymentStatus = () => {
    const totalParticipants = order.paidParticipants?.length || 0;
    const isComplete = totalParticipants === 4;
    const progressPercent = (totalParticipants / 4) * 100;

    return (
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {`${totalParticipants}/4`}
        </span>
        <div className="w-24">
          <Progress
            value={progressPercent}
            className={`h-2 ${
              isComplete ? "bg-gray-200" : "animate-pulse bg-gray-100"
            }`}
          />
        </div>
        {isComplete ? (
          <CheckCircle2 className="w-6 h-6 text-green-500 animate-bounce" />
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-gray-300 border-t-purple-600 animate-spin" />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tighter flex flex-col gap-5 md:flex-row md:justify-between">
        <span>
          Order Status:{" "}
          {order.paidParticipants &&
          getOrderStatusInfo().label === "Awaiting Restaurant Confirmation"
            ? "Group Order Completed"
            : getOrderStatusInfo().label}
        </span>
        {getOrderStatusInfo().label !== "Delivered" &&
        getOrderStatusInfo().label !== "Awaiting Payment From Other Members" && !order.paidParticipants? (
          <span>Expected by: {getExpectedDelivery()}</span>
        ) : (order.paidParticipants)?renderPaymentStatus():(
          ""
        )}
      </h1>
      <Progress
        className={`h-2 ${
          getOrderStatusInfo().label === "Delivered" ||
          (order.paidParticipants &&
            getOrderStatusInfo().label === "Awaiting Restaurant Confirmation")
            ? "bg-green-100"
            : "animate-pulse bg-purple-100"
        }`}
        value={
          order.paidParticipants &&
          getOrderStatusInfo().label === "Awaiting Restaurant Confirmation"
            ? 100
            : getOrderStatusInfo().progressValue
        }
      />
    </div>
  );
};

export default OrderStatusHeader;

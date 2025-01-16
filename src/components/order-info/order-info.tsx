import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  console.log('OrderInfo:');

  const ingredients: TIngredient[] = useSelector(
    (state: any) => state.burgerSlice.allIngredients
  );
  const urlParams = useParams();
  const location = useLocation();
  let orders: TOrder[] =
    location.pathname && location.pathname.includes('feed')
      ? useSelector((state: any) => state.orderReducer.feedOrders)
      : [];
  orders =
    location.pathname && location.pathname.includes('profile')
      ? useSelector((state: any) => state.orderReducer.profileOrders)
      : orders;
  /* Готовим данные для отображения */
  const orderDataList: TOrder[] = orders.filter(
    (order: TOrder) =>
      urlParams && urlParams.number && order.number === Number(urlParams.number)
  );
  const orderData: TOrder | null =
    orderDataList.length > 0 ? orderDataList[0] : null;
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData?.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

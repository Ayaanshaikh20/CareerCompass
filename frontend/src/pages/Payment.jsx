import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Button } from '@mui/material';

const Payment = () => {
  const queryClient = useQueryClient();

  const location = useLocation();

  const navigate = useNavigate();

  const { totalAmount } = location.state;

  const { data: userDetails } = useQuery({
    queryKey: ['user'],
    queryFn: () => queryClient.getQueryData(['user']),
  });

  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: () => queryClient.getQueryData(['cart']),
  });

  const userId = JSON.parse(localStorage.getItem('user'))._id;

  const handlePlaceOrder = async () => {
    const reqData = {
      products: cart,
      customerName: userDetails.customerName,
      customerAddress: userDetails.customerAddress,
      customerPhone: userDetails.customerPhone,
      totalAmount: totalAmount,
      status: 'Pending',
      userId: userId,
    };
    const response = await axios.post('/api/add-order', reqData);
    const { status_code } = response.data;
    if (status_code === 201) {
      const { message } = response.data;
      toast.success(message);
      queryClient.setQueryData(['cart'], []);
      queryClient.setQueryData(['products'], (oldData) =>
        oldData.map((product) => {
          return {
            ...product,
            quantity: 0,
            amount: 0,
          };
        }),
      );
      setTimeout(() => {
        navigate('/');
      }, [4000]);
    }
  };

  return (
    <>
      <Toaster />
      <div className='flex flex-col items-center justify-center p-6'>
        <div className='bg-white shadow-lg rounded-lg p-4 text-center'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>Scan & Pay</h2>
          <p className='text-gray-600 mb-4'>
            Scan the QR code below to complete your payment securely.
          </p>
          <div className='border-2 flex justify-center w-full border-gray-300 rounded-lg'>
            <img
              src='https://res.cloudinary.com/derk6ssoa/image/upload/v1743606993/Screenshot_2025-04-02_at_8.43.24_PM_1_d3mlry.png'
              alt='QR Code'
              className='w-80 h-80 object-contain'
            />
          </div>
          <p className='text-gray-500 mt-4'>
            Ensure you enter the correct amount before confirming the
            transaction.
          </p>
          <p className='text-gray-800 font-bold mt-4'>
            Total Amount: {totalAmount}
          </p>
          <Button
            onClick={handlePlaceOrder}
            variant='contained'
            className='mt-4 px-6 py-2 rounded-lg'
            disabled={cart.length === 0}
          >
            Place Order
          </Button>
        </div>
      </div>
    </>
  );
};

export default Payment;

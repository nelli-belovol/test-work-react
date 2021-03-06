import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productsSelectors, productsActions } from 'redux/products';

import { Container } from '../Container.styled';
import {
  CartEl,
  HeaderEl,
  CartList,
  CartItem,
  ProductInfo,
  Title,
  AddQuantity,
  ImageEl,
  Image,
  Price,
  IncrDecrButton,
  Wraper,
  DelButton,
  PriceTotal,
} from './Cart.styled';

import { Button } from '../../styles/Buttons';
import { IoAdd, IoRemove, IoClose } from 'react-icons/io5';

export default function Cart() {
  const dispatch = useDispatch();
  const [totalSum, setTotalSum] = useState(0);
  const cartProducts = useSelector(productsSelectors.getCartProducts);

  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  useEffect(() => {
    let summ = cartProducts.reduce(
      (total, { quantity, price }) => price * quantity + total,
      0,
    );
    setTotalSum(summ.toFixed(2));
  }, [dispatch, cartProducts]);

  const handleDelProduct = id => {
    dispatch(productsActions.delProduct(id));
  };

  const handleClick = product => {
    dispatch(productsActions.delQuantity(product));
  };

  const handleIncrement = product => {
    dispatch(productsActions.addQuantity(product));
  };

  const handleDecrement = product => {
    if (product.quantity === 1) {
      return;
    }
    dispatch(productsActions.delQuantity(product));
  };

  return (
    <Container>
      <CartEl>
        <HeaderEl>
          <Button onClick={goBack} type="button">
            Go back
          </Button>
          <p onClick={() => navigate(`/products`)} to="/products">
            Back to products
          </p>
        </HeaderEl>
        <CartList>
          {cartProducts &&
            cartProducts.map(product => {
              return (
                <CartItem key={product.id}>
                  <ImageEl>
                    <Image src={product.image} alt={product.description} />
                  </ImageEl>

                  <ProductInfo>
                    <Title onClick={() => navigate(`/products/${product.id}`)}>
                      {product.title}
                    </Title>
                    <p>ProductID:{product.id}</p>
                  </ProductInfo>

                  <Wraper>
                    <AddQuantity>
                      <IncrDecrButton
                        onClick={() => handleDecrement(product)}
                        type="button"
                      >
                        <IoRemove />
                      </IncrDecrButton>
                      <div>{product.quantity} </div>
                      <IncrDecrButton
                        onClick={() => handleIncrement(product)}
                        type="button"
                      >
                        <IoAdd />
                      </IncrDecrButton>
                    </AddQuantity>
                    <Price className="productSum">
                      &#36;{' '}
                      {((product.quantity * product.price * 100) / 100).toFixed(
                        2,
                      )}
                    </Price>
                  </Wraper>
                  <DelButton
                    onClick={() => handleDelProduct(product.id)}
                    type="button"
                  >
                    <IoClose
                      fill="red"
                      position="absolute"
                      top=" 50%"
                      left="50%"
                    />
                  </DelButton>
                </CartItem>
              );
            })}
        </CartList>
        {cartProducts[0] ? (
          <>
            <PriceTotal>Total: &#36;{totalSum}</PriceTotal>
            <Button onClick={handleClick} type="submit">
              Checkout
            </Button>
          </>
        ) : (
          <p>Cart is empty</p>
        )}
      </CartEl>
    </Container>
  );
}

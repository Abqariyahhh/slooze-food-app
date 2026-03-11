import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      email
      firstName
      role
      country
      userId
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      email
      firstName
      role
      country
      userId
    }
  }
`;

export const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants {
      id
      name
      description
      country
      address
      rating
      isActive
      menuItems {
        id
        name
        description
        price
        imageUrl
        isAvailable
        restaurantId
      }
    }
  }
`;

export const GET_RESTAURANT = gql`
  query GetRestaurant($id: ID!) {
    restaurant(id: $id) {
      id
      name
      description
      country
      address
      rating
      menuItems {
        id
        name
        description
        price
        isAvailable
      }
    }
  }
`;

export const GET_MY_ORDERS = gql`
  query GetMyOrders {
    myOrders {
      id
      userId
      restaurantId
      restaurantName
      status
      totalAmount
      notes
      createdAt
      items {
        id
        menuItemId
        menuItemName
        quantity
        price
      }
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      status
      totalAmount
      restaurantName
      createdAt
      items {
        id
        menuItemName
        quantity
        price
      }
    }
  }
`;

// ✅ totalAmount added — needed for dashboard totalSpent recalculation
export const CHECKOUT_ORDER = gql`
  mutation CheckoutOrder($orderId: ID!) {
    checkoutOrder(orderId: $orderId) {
      id
      status
      totalAmount
    }
  }
`;

// ✅ totalAmount added — needed for dashboard totalSpent recalculation
export const CANCEL_ORDER = gql`
  mutation CancelOrder($orderId: ID!) {
    cancelOrder(orderId: $orderId) {
      id
      status
      totalAmount
    }
  }
`;

export const GET_MY_PAYMENTS = gql`
  query GetMyPayments {
    myPayments {
      id
      userId
      type
      last4
      nickname
      isDefault
      createdAt
    }
  }
`;

export const ADD_PAYMENT = gql`
  mutation AddPayment($input: AddPaymentInput!) {
    addPayment(input: $input) {
      id
      type
      last4
      nickname
      isDefault
      createdAt
    }
  }
`;

export const UPDATE_PAYMENT = gql`
  mutation UpdatePayment($id: ID!, $input: UpdatePaymentInput!) {
    updatePayment(id: $id, input: $input) {
      id
      type
      last4
      nickname
      isDefault
    }
  }
`;

export const DELETE_PAYMENT = gql`
  mutation DeletePayment($id: ID!) {
    deletePayment(id: $id)
  }
`;

export const GET_ME = gql`
  query Me {
    me {
      id
      email
      firstName
      lastName
      role
      country
    }
  }
`;

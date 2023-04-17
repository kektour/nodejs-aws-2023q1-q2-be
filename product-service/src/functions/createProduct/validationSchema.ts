import * as yup from 'yup';

const ERRORS = {
  REQUIRED: 'This is required field',
  NUMBER: 'Field should be a number',
  INTEGER: 'Field should be a integer',
};

export const validationSchema = yup.object().shape({
  title: yup.string().trim().required(ERRORS.REQUIRED),
  description: yup.string().required(ERRORS.REQUIRED),
  price: yup.number().typeError(ERRORS.NUMBER).integer(ERRORS.INTEGER).required(ERRORS.REQUIRED),
  count: yup.number().typeError(ERRORS.NUMBER).integer(ERRORS.INTEGER).required(ERRORS.REQUIRED),
});

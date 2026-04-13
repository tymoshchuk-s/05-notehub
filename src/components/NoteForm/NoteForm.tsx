import { createNote } from '../../services/noteService';
import css from './NoteForm.module.css'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";

interface NoteFormProps {
    onClose: () => void;
}

interface FormValues {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping"
}

const OrderFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title too short")
    .max(50, "Title too long")
    .required("This is a required field!"),
  content: Yup.string()
    .max(500, "Content too long")
    .notRequired(),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid notes tag")
    .required(),
});

const initialValues: FormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
        mutationFn: createNote,
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ['notes'] })
          onClose();
        },
        onError() {
            console.log('error')
        },
    });
  
  const handleSubmit = (
  values: FormValues,
  helpers: FormikHelpers<FormValues>
) => {
  createMutation.mutate(values);
  helpers.resetForm();
};
    
  return (
      <Formik
      initialValues={initialValues}
      validationSchema={OrderFormSchema}
      onSubmit={handleSubmit}
    >
        <Form className={css.form}>
  
  <div className={css.formGroup}>
    <label htmlFor="title">Title</label>
    <Field as="input" name="title" className={css.input} />
    <ErrorMessage name="title" component="span" className={css.error} />
  </div>

  <div className={css.formGroup}>
    <label htmlFor="content">Content</label>
    <Field as="textarea" name="content" className={css.textarea} />
    <ErrorMessage name="content" component="span" className={css.error} />
  </div>

  <div className={css.formGroup}>
    <label htmlFor="tag">Tag</label>
    <Field as="select" name="tag" className={css.select}>
      <option value="Todo">Todo</option>
      <option value="Work">Work</option>
      <option value="Personal">Personal</option>
      <option value="Meeting">Meeting</option>
      <option value="Shopping">Shopping</option>
    </Field>
    <ErrorMessage name="tag" component="span" className={css.error} />
  </div>

  <div className={css.actions}>
    <button type="button" onClick={onClose} className={css.cancelButton}>
      Cancel
    </button>

    <button type="submit" className={css.submitButton} disabled={createMutation.isPending}>
      {createMutation.isPending ? 'Creating...' : 'Create note'}
    </button>
  </div>

</Form>
      </Formik>)
}
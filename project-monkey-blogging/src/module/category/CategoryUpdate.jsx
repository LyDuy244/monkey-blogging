import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardHeading from "../dashboard/DashboardHeading";
import { Field, FieldCheckBoxes } from "../../components/field";
import { Label } from "../../components/Label";
import { InputField } from "../../components/InputField";
import { Radio } from "../../components/checkbox";
import { Button } from "../../components/button";
import { useForm } from "react-hook-form";
import { categoryStatus, userRole } from "../../utils/constans";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import slugify from "slugify";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/auth-context";

const CategoryUpdate = () => {
  const [params] = useSearchParams();
  const categoryId = params.get('id')
  const {control, handleSubmit, reset, watch, formState: {isSubmitting}} = useForm({
    mode: 'onChange',

  });
  const watchStatus = watch('status')
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData(){
      const colRef = doc(db, 'category', categoryId)
      const singleDoc = await getDoc(colRef);
      reset(singleDoc.data())
    }

    fetchData()
  },[categoryId, reset])

  const handleUpdateCategory = async (values) => {
    const colRef = doc(db, 'category', categoryId)
    await updateDoc(colRef, {
      name: values.name,
      slug: slugify(values.slug || values.name, {lower: true}),
      status: Number(values.status),
    });
    toast.success("Update Category successfully")
    navigate('/manage/category')
  }
  
  const {userInfo} = useAuthContext();
  if(userInfo.role !== userRole.ADMIN) return;
  if (!categoryId) return null;

  return <div>
    <DashboardHeading title="Update Category" desc={`Update your category id: ${categoryId}`}></DashboardHeading>
    <form onSubmit={handleSubmit(handleUpdateCategory)} autoComplete="off">
      <div className="form-layout">
        <Field>
          <Label>Name</Label>
          <InputField
            control={control}
            name="name"
            placeholder="Enter your category name"
            required
          ></InputField>
        </Field>
        <Field>
          <Label>Slug</Label>
          <InputField
            control={control}
            name="slug"
            placeholder="Enter your slug"
          ></InputField>
        </Field>
      </div>
      <div className="form-layout">
        <Field>
          <Label>Status</Label>
          <FieldCheckBoxes>
            <Radio
              name="status"
              control={control}
              checked={Number(watchStatus) === categoryStatus.APPROVED}
              value={categoryStatus.APPROVED}>
              Approved
            </Radio>
            <Radio name="status"
              control={control}
              checked={Number(watchStatus) === categoryStatus.UNAPPROVED}
              value={categoryStatus.UNAPPROVED}>
              Unapproved
            </Radio>
          </FieldCheckBoxes>
        </Field>
      </div>
      <Button type='submit' kind="primary" className="mx-auto min-w-[200px]" isLoading={isSubmitting} disabled={isSubmitting}>
        Update category
      </Button>
    </form>
  </div>;
};

export default CategoryUpdate;
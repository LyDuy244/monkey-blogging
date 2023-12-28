
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Field } from "../../components/field";
import { Label } from "../../components/Label";
import { InputField } from "../../components/InputField";
import { Radio } from "../../components/checkbox";
import { Dropdown } from "../../components/dropdown";
import { Button } from "../../components/button";
import slugify from "slugify";
import ImageUpload from "../../components/image/ImageUpload";
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import Toggle from "../../components/toggle/Toggle";
import { useAuthContext } from "../../context/auth-context";
import { toast } from "react-toastify";
import { postStatus, userRole } from "../../utils/constans";
import DashboardHeading from "../dashboard/DashboardHeading";

const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
  const { userInfo } = useAuthContext()
  const { control, watch, setValue, handleSubmit, getValues, reset, formState: { isSubmitting } } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      status: postStatus.PENDING,
      hot: false,
      image: "",
      category: {},
      user: {},
      createdAt: '',
      content: "",
    },
  });
  const watchStatus = watch("status");
  const watchHot = watch('hot');
  const { image, progress, handleSelectImage, handleDeleteImage, handleResetUpload } = useFirebaseImage(setValue, getValues);
  const [selectCategory, setSelectCategory] = useState('');
  const [categories, setCategories] = useState([]);
  // console.log("PostAddNew ~ watchCategory", watchCategory);

  useEffect(() => {
    async function fetchUserData() {
      if (!userInfo.id) return;
      const colRef = doc(db, 'users', userInfo?.id)
      const docRef = await getDoc(colRef)
      setValue('user', {
        id: docRef.id,
        ...docRef.data()
      })
    }
    fetchUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.id])

  useEffect(() => {
    async function getData() {
      const colRef = collection(db, 'category')
      const q = query(colRef, where('status', '==', 1))

      const querySnapshot = await getDocs(q);
      let results = []
      querySnapshot.forEach((doc) => (
        results.push({
          id: doc.id,
          ...doc.data()
        })
      ))
      setCategories(results)
    }

    getData()
  }, [])

  useEffect(() => {
    document.title = 'Monkey Blogging - Add new post'
  }, [])

  const handleClickOption = async (item) => {
    const colRef = doc(db, 'category', item.id)
    const docRef = await getDoc(colRef)
    setValue('category', {
      id: docRef.id,
      ...docRef.data()
    })
    setSelectCategory(item)
  }


  const addPostHandler = async (values) => {
    try {
      const cloneValues = { ...values };
      console.log("🚀 ~ file: PostAddNew.jsx:54 ~ addPostHandler ~ cloneValues:", cloneValues)
      cloneValues.slug = slugify(values.slug || values.title, { lower: true });
      // console.log("🚀 ~ file: PostAddNew.jsx:44 ~ addPostHandler ~ cloneValues:", cloneValues)
      cloneValues.status = Number(values.status);
      const colRef = collection(db, 'posts');
      await addDoc(colRef, {
        ...cloneValues,
        image,
        createdAt: serverTimestamp()
      })
      toast.success("Create new post successfully")
      reset({
        title: "",
        slug: "",
        status: postStatus.PENDING,
        hot: false,
        image: "",
        category: {},
        user: {},
        createdAt: '',
        content: "",
      })
      setSelectCategory({})
      handleResetUpload()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <PostAddNewStyles>
      <DashboardHeading title="Add new post"></DashboardHeading>
      <form onSubmit={handleSubmit(addPostHandler)}>
        <div className="grid grid-cols-2 gap-x-10 mb-10">
          <Field>
            <Label>Title</Label>
            <InputField
              control={control}
              placeholder="Enter your title"
              name="title"
            ></InputField>
          </Field>
          <Field>
            <Label>Slug</Label>
            <InputField
              control={control}
              placeholder="Enter your slug"
              name="slug"
            ></InputField>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-x-10 mb-10">
          <Field>
            <Label>Image</Label>
            <ImageUpload name='image' onChange={handleSelectImage} progress={progress} image={image} handleDeleteImage={handleDeleteImage}></ImageUpload>
          </Field>
          <Field>
            <Label>Category</Label>
            <Dropdown>
              <Dropdown.Select placeholder={`${selectCategory.name || ' Select the category'}`}></Dropdown.Select>
              <Dropdown.List>

                {categories.length > 0 && categories.map(item => (
                  <Dropdown.Option key={item.id} onClick={() => handleClickOption(item)}>{item.name}</Dropdown.Option>
                ))}
              </Dropdown.List>
            </Dropdown>
            {
              selectCategory.name && (
                <span className="inline-block p-3 rounded-lg bg-green-100 text-green-600 font-medium">{selectCategory?.name}</span>
              )
            }
          </Field>
          {
            userInfo?.role === userRole.ADMIN &&
            <>
              <Field>
                <Label>Status</Label>
                <div className="flex items-center gap-x-5">
                  <Radio
                    name="status"
                    control={control}
                    checked={Number(watchStatus) === postStatus.APPROVED}
                    value={postStatus.APPROVED}
                  >
                    Approved
                  </Radio>
                  <Radio
                    name="status"
                    control={control}
                    checked={Number(watchStatus) === postStatus.PENDING}
                    value={postStatus.PENDING}
                  >
                    Pending
                  </Radio>
                  <Radio
                    name="status"
                    control={control}
                    checked={Number(watchStatus) === postStatus.REJECTED}
                    value={postStatus.REJECTED}
                  >
                    Reject
                  </Radio>
                </div>
              </Field>
              <Field>
                <Label>Features posts</Label>
                <Toggle on={watchHot === true} onClick={() => setValue('hot', !watchHot)}></Toggle>
              </Field>
            </>
          }
        </div>

        <Button type="submit" kind='primary' className="mx-auto min-w-[250px]" isLoading={isSubmitting} disabled={isSubmitting}>
          Add new post
        </Button>
      </form>
    </PostAddNewStyles>
  );
};

export default PostAddNew;
import React, { useEffect, useMemo, useState } from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import { Field } from "../../components/field";
import { InputField } from "../../components/InputField";
import { Label } from "../../components/Label";
import ImageUpload from "../../components/image/ImageUpload";
import { Dropdown } from "../../components/dropdown";
import { Radio } from "../../components/checkbox";
import Toggle from "../../components/toggle/Toggle";
import { Button } from "../../components/button";
import { useForm } from "react-hook-form";
import { categoryStatus, postStatus, userRole } from "../../utils/constans";
import { db } from "../../firebase/firebase-config";
import { useSearchParams } from "react-router-dom";
import { collection, doc, getDoc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from "react-toastify";
import ImageUploader from "quill-image-uploader";
import axios from "axios";
import { useAuthContext } from "../../context/auth-context";
import NotFoundPage from "../../pages/NotFoundPage";
Quill.register('modules/imageUploader', ImageUploader);
  
const PostUpdate = () => {
  const [params] = useSearchParams();
  const postId = params.get('id');
  const [postItem, setPostItem] = useState({})
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState('');
  const [content, setContent] = useState('');
  const {userInfo} = useAuthContext();
  console.log("🚀 ~ file: PostUpdate.jsx:32 ~ PostUpdate ~ userInfo:", userInfo)

  const { handleSubmit, control, reset, setValue, getValues, watch, formState: { isSubmitting, isValid } } = useForm({
    mode: 'onChange',
  })

  const imageUrl = getValues('image')
  const image_name = getValues('image_name')
  const deletePostImage = async () => {
    const colRef = doc(db, 'posts', postId);
    await updateDoc(colRef, { image: '' })
  }
  const { image, progress, handleSelectImage, setImage, handleDeleteImage } = useFirebaseImage(setValue, getValues, image_name, deletePostImage);

  const watchHot = watch('hot')
  const watchStatus = watch('status')

  useEffect(() => {
    setImage(imageUrl)
  }, [imageUrl, setImage])

  useEffect(() => {
    const q = query(collection(db, 'category'), where("status", '==', categoryStatus.APPROVED))
    onSnapshot(q, (snapShot) => {
      const results = []
      snapShot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        })
      })
      setCategories(results)
    })
  }, [])

  useEffect(() => {
    async function getCategoriesData() {
      if (!postId) return;
      const colRef = doc(db, 'posts', postId)
      const singleDoc = await getDoc(colRef);
      reset({
        ...singleDoc.data()
      })
      setPostItem(singleDoc.data())
      setSelectCategory(singleDoc.data()?.category || '')
      setContent(singleDoc.data()?.content || '')
    }
    getCategoriesData()
  }, [postId, reset])

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


  const handleClickOption = async (category) => {
    const docRef = doc(db, 'category', category.id)
    const singleDoc = await getDoc(docRef)

    setValue("category", {
      id: singleDoc.id,
      ...singleDoc.data()
    })

    setSelectCategory(category)
  }


  const handleUpdatePost = async (values) => {
    console.log("🚀 ~ file: PostUpdate.jsx:83 ~ handleUpdatePost ~ values:", values)
    if (!isValid) return;

    const docRef = doc(db, 'posts', postId)
    await updateDoc(docRef, {
      ...values,
      status: Number(values.status),
      content
    })
    toast.success('Update post successfully')
  }

  const modules = useMemo(() => ({
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['link', 'image']
    ],
    imageUploader: {
      upload: async (file) => {
        const bodyFromData = new FormData();
        bodyFromData.append('image', file)
        const response = await axios({
          method: 'Post',
          url: 'https://api.imgbb.com/1/upload?key=a57bdca58328c969b80ebeb53df97c0b', 
          data: bodyFromData,
          headers: {
            "content-type": "multipart/form-data"
          }
        })

        return response.data.data.url
      }
    }
  }), []);

  if (!postId) return;
  if(!userInfo || (userInfo?.id !== postItem?.user?.id && userInfo?.role !== userRole.ADMIN)) return <></>


  return <div>
    <DashboardHeading title="Update post" desc="Update post content"></DashboardHeading>
    <form onSubmit={handleSubmit(handleUpdatePost)}>
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
            <Dropdown.Select placeholder={`${selectCategory?.name || ' Select the category'}`}></Dropdown.Select>
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
      <div className="grid grid-cols-1 gap-x-10 mb-10">
        <Field>
          <Label>Content</Label>
          <div className="w-full entry-content">
            <ReactQuill modules={modules} theme="snow" value={content} onChange={setContent} />;
          </div>
        </Field>
      </div>
      <Button type="submit" kind='primary' className="mx-auto min-w-[250px]" isLoading={isSubmitting} disabled={isSubmitting}>
        Update post
      </Button>
    </form>
  </div>;
};

export default PostUpdate;
import slugify from "slugify";
import { Button } from "../../components/button";
import { Radio } from "../../components/checkbox";
import { Field, FieldCheckBoxes } from "../../components/field";
import { InputField } from "../../components/InputField";
import { Label } from "../../components/Label";
import DashboardHeading from "../dashboard/DashboardHeading";
import React from "react";
import { useForm } from "react-hook-form";
import { categoryStatus, userRole } from "../../utils/constans";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/auth-context";

const CategoryAddNew = () => {
    const {
        control,
        watch,
        reset,
        handleSubmit,
        formState: {
            isSubmitting,
            isValid
        }
    } = useForm({
        mode: "onChange",
        defaultValues: {
            name: '',
            slug: '',
            status: 1,
            createdAt: new Date(),
        }
    });

    const handleAddNewCategory = async (values) => {
        if(!isValid) return;
        const newValues = { ...values };
        newValues.slug = slugify(newValues.slug || newValues.name, { lower: true })
        newValues.status = Number(newValues.status)
        const colRef = collection(db, 'category');
        try {
            await addDoc(colRef, {
                ...newValues,
                createdAt: serverTimestamp()
            })

            toast.success("Create category successfully")
        } catch (error) {
            toast.error(error.message)
        } finally {
            reset({
                name: '',
                slug: '',
                status: 1,
                createdAt: new Date(),
            });
        }

    }

    const watchStatus = watch("status");
    const {userInfo} = useAuthContext();
    if(userInfo.role !== userRole.ADMIN) return;
    return (
        <div>
            <DashboardHeading
                title="New category"
                desc="Add new category"
            ></DashboardHeading>
            <form onSubmit={handleSubmit(handleAddNewCategory)} autoComplete="off">
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
                <Button type='submit' kind="primary" className="mx-auto w-[200px]" isLoading={isSubmitting} disabled={isSubmitting}>
                    Add new category
                </Button>
            </form>
        </div>
    );
};

export default CategoryAddNew;
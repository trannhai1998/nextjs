'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
	UpdateMeBody,
	UpdateMeBodyType,
} from '@/schemaValidations/account.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useRef, useState } from 'react';
import { useAccountMe, useUpdateMe } from '@/queries/useAccount';
import { uploadMediaMutation } from '@/queries/useMedia';
import { toast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';

export default function UpdateProfileForm() {
	const avatarInputRef = useRef<HTMLInputElement>(null);
	const [fileAvatar, setFileAvatar] = useState<File | null>(null);
	const { data, refetch } = useAccountMe();
	const updateMeMutation = useUpdateMe();
	const useUploadMediaMutation = uploadMediaMutation();

	const form = useForm<UpdateMeBodyType>({
		resolver: zodResolver(UpdateMeBody),
		defaultValues: {
			name: '',
			avatar: '',
		},
	});

	const previewAvatar = () => {
		if (fileAvatar) {
			return URL.createObjectURL(fileAvatar);
		}

		return form.watch('avatar') || '';
	};

	useEffect(() => {
		if (data) {
			const { name, avatar } = data.payload.data;
			form.reset({
				name,
				avatar: avatar ?? '',
			});
		}
	}, [data]);

	const onReset = () => {
		form.reset();
		setFileAvatar(null);
	};

	const onSubmit = async (event: React.FormEvent) => {
		if (updateMeMutation.isPending) {
			return;
		}

		event.preventDefault();

		try {
			const bodyRequest = {
				name: form.getValues('name') || '',
				avatar: form.getValues('avatar') || '',
			};
			if (fileAvatar) {
				const formData = new FormData();
				formData.append('file', fileAvatar);
				const uploadImageResult =
					await useUploadMediaMutation.mutateAsync(formData);
				console.log(uploadImageResult);
				const imageUrl = uploadImageResult.payload.data;

				bodyRequest.avatar = imageUrl;
			}
			const result = await updateMeMutation.mutateAsync(bodyRequest);
			refetch();
			toast({
				description: result.payload.message,
			});
		} catch (error) {
			handleErrorApi({
				error,
				setError: form.setError,
			});
		}
	};

	return (
		<Form {...form}>
			<form
				noValidate
				className="grid auto-rows-max items-start gap-4 md:gap-8"
				onReset={onReset}
				onSubmit={onSubmit}>
				<Card x-chunk="dashboard-07-chunk-0">
					<CardHeader>
						<CardTitle>Thông tin cá nhân</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-6">
							<FormField
								control={form.control}
								name="avatar"
								render={({ field }) => (
									<FormItem>
										<div className="flex gap-2 items-start justify-start">
											<Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
												<AvatarImage
													src={previewAvatar()}
												/>
												<AvatarFallback className="rounded-none">
													{form.getValues('name')}
												</AvatarFallback>
											</Avatar>
											<input
												type="file"
												accept="image/*"
												className="hidden"
												ref={avatarInputRef}
												multiple={false}
												onChange={(e) => {
													const file =
														e.target.files?.[0];
													if (file) {
														setFileAvatar(file);
													}
												}}
											/>
											<button
												className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
												type="button"
												onClick={() => {
													avatarInputRef.current?.click();
												}}>
												<Upload className="h-4 w-4 text-muted-foreground" />
												<span className="sr-only">
													Upload
												</span>
											</button>
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<div className="grid gap-3">
											<Label htmlFor="name">Tên</Label>
											<Input
												id="name"
												type="text"
												className="w-full"
												{...field}
											/>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							<div className=" items-center gap-2 md:ml-auto flex">
								<Button
									variant="outline"
									size="sm"
									type="reset">
									Hủy
								</Button>
								<Button size="sm" type="submit">
									Lưu thông tin
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</form>
		</Form>
	);
}

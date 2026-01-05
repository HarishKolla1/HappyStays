import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Loader2, PenSquare, Upload } from 'lucide-react';
import { useAuth } from '../../../hooks';

const EditProfileDialog = () => {
  const { user, setUser, uploadPicture, updateUser } = useAuth();
  const uploadRef = useRef(null);
  
  // State for the raw file object (for uploading)
  const [pictureFile, setPictureFile] = useState(null);
  // State for previewing the image immediately
  const [previewUrl, setPreviewUrl] = useState(user?.picture || '');
  
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name || '',
    password: '',
    confirm_password: '',
  });

  const handleImageClick = () => {
    uploadRef.current.click();
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPictureFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create local preview
    }
  };

  const handleUserData = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    const { name, password, confirm_password } = userData;

    // 1. Validation
    if (!name || name.trim() === '') {
      setLoading(false);
      return toast.error("Name Can't be empty");
    }

    // Only validate password if the user actually typed something in the password fields
    if (password || confirm_password) {
        if (password !== confirm_password) {
            setLoading(false);
            return toast.error("Passwords don't match");
        }
    }

    try {
      let finalPictureUrl = user.picture; // Default to existing picture

      // 2. Upload Image (Only if a new file was selected)
      if (pictureFile) {
        // Assume uploadPicture returns the string URL of the uploaded image
        const uploadedUrl = await uploadPicture(pictureFile);
        if (uploadedUrl) {
            finalPictureUrl = uploadedUrl;
        } else {
            toast.error("Failed to upload image");
            setLoading(false);
            return;
        }
      }

      // 3. Prepare Payload
      const userDetails = {
        name: userData.name,
        picture: finalPictureUrl,
      };

      // Only add password to payload if user changed it
      if (password) {
        userDetails.password = password;
      }

      // 4. Update User Data
      const res = await updateUser(userDetails);
      
      if (res && res.user) {
        setUser(res.user);
        toast.success('Profile updated successfully!');
        // Reset sensitive fields
        setUserData(prev => ({ ...prev, password: '', confirm_password: '' }));
      } else {
        toast.error('Update failed');
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-600 ">
          <PenSquare className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <div className="flex justify-center">
          <div className="relative h-40 w-40 cursor-pointer overflow-hidden rounded-full bg-gray-200">
            <div
              className="absolute flex h-full w-full items-center justify-center bg-gray-200 hover:z-10 opacity-0 hover:opacity-50 transition-opacity"
              onClick={handleImageClick}
            >
              <input
                type="file"
                className="hidden"
                ref={uploadRef}
                onChange={handlePictureChange}
                accept="image/*"
              />
              <Upload height={50} width={50} color="#000" />
            </div>

            {/* Always show the previewUrl (which is either the new file blob or the old URL) */}
            <Avatar className="h-full w-full">
                <AvatarImage src={previewUrl} className="object-cover" />
            </Avatar>
          </div>
        </div>

        {/* Update form */}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={userData.name}
              className="col-span-3"
              onChange={handleUserData}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              New Password
            </Label>
            <Input
              id="password"
              name="password"
              placeholder="(Optional)"
              value={userData.password}
              className="col-span-3"
              type="password"
              onChange={handleUserData}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirm_password" className="text-right">
              Confirm Password
            </Label>
            <Input
              id="confirm_password"
              name="confirm_password"
              placeholder="(Optional)"
              value={userData.confirm_password}
              className="col-span-3"
              type="password"
              onChange={handleUserData}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={loading}
            type="submit"
            className="w-full"
            onClick={handleSaveChanges}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
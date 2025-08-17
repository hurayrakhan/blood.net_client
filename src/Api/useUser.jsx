import { use } from "react";
import { AuthContext } from "../Providers/AuthProvider";

const {user} = use(AuthContext)

const user = ( ) => {
    
    const profileEmail = user.email
    const { data: profile = {}, isLoading } = useQuery({
        queryKey: ['profile', profileEmail],
        queryFn: () => axiosSecure.get(`/users/${encodeURIComponent(profileEmail)}`).then(res => res.data),
        enabled: !!profileEmail
      });
     return profile
}
'use client'
import Box from "./box";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import useUser from '../../hooks/useUser';

export default function Admin() {
    const router = useRouter();
    const [user] = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const url = 'http://localhost/next/admin_manager.php';
    const [data, setData] = useState()
    const [data_array, setData_array] = useState([])

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (user?.user_type !== 'admin') {
            router.push('/login');
            return;
        }
        setIsLoading(false);
    }, [user]);

    useEffect(() => {
        if (!isLoading) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    setData(data);
                })
                .catch(error => console.error(error));
        }
    }, [isLoading])

    useEffect(() => {
        if (!isLoading) {
            for (let i = 0; i < data?.length; i++) {
                const element = data[i];
                const elementName = Object.keys(element[0])[0];
                if (typeof element !== "undefined" && element[0]?.price_pending !== null) {
                    setData_array((prev) => (
                        [...prev,
                        {
                            id: i,
                            name: `${elementName}`,
                            value: element[0][`${elementName}`]
                        }]))
                }
            }
        }
        return () => {
            return data;
        };
    }, [data, isLoading]);

    if (isLoading) {
        return null; // Don't render anything while checking auth
    }

    return (
        <section className="dashboard">
            <h1 className="title">TABLEAU DE BORD</h1>
            <div className="box-container">
                {data_array?.map(item => {
                    return <Box key={item.id} data={item} />
                })}
            </div>
        </section>
    )
}
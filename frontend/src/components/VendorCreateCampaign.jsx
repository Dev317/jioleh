import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { client } from '../client';
import { fetchVendor } from '../utils/fetchVendor';

export default function VendorCreateCampaign() {
    const [vendor, setVendor] = useState(fetchVendor());
    const [form, setForm] = useState({});
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState({
        message: "",
        show: false,
    });

    const setFormField = (field, value) => {
        setForm({
            ...form,
            [field]: value,
        });
    };

    useEffect(() => {
        localStorage.getItem("campaign") ? setVendor(JSON.parse(localStorage.getItem("campaign"))) : setVendor(fetchVendor());
    }, []);

    useEffect(() => {
        localStorage.setItem("campaign", JSON.stringify(vendor));

        if (errorMessage.show) {
            new Promise((r) => {
                setTimeout(r, 6000);
            }).then(() => setErrorMessage({ message: "", show: false }));
        }
    }, [vendor, errorMessage.show]);

    const handleSubmit = (e) => {
        e.preventDefault();
        client
            .patch(vendor._id)
            .set({
                hasCampaign: true,
                campaignName: form.campaignName,
                budget: parseFloat(form.budget),
                rewardAmount: parseFloat(form.rewardAmount),
                dailyLimit: parseInt(form.dailyLimit),
                startDate: form.startDate,
                duration: parseInt(form.duration)
            })
            .commit()
            .then((updatedVendor) => {
                localStorage.setItem("campaign", JSON.stringify(updatedVendor))
                navigate("/vendor")
            })
            .catch((err) =>
                setErrorMessage({ message: err.message, show: true })
            );
    };

    return (
        <div className='relative pb-2 h-full justify-center items-center'>
            <div className='flex flex-col pb-5'>
                <div className='relative flex flex-col mb-7'>
                    {vendor.hasCampaign ? <p className="block font-bold mb-2 mt-3">A campaign has already been created!</p> :
                        <form
                            className="w-full max-w-sm text-sm"
                            onSubmit={handleSubmit}
                        >
                            <div className="mb-4">
                                <label className="block font-bold mb-2 mt-3" for="campaignName">
                                    Campaign Name
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3"
                                    id="campaignName"
                                    type="text"
                                    value={form.campaignName}
                                    onChange={(e) => setFormField("campaignName", e.target.value)}
                                    placeholder="Enter campaign name..."
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-bold mb-2" for="budget">
                                    Campaign Budget
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3"
                                    id="budget"
                                    type="number"
                                    step="0.01"
                                    value={form.budget}
                                    onChange={(e) => setFormField("budget", e.target.value)}
                                    placeholder="Enter your budget for the campaign..."
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-bold mb-2" for="rewardAmount">
                                    Reward Amount per Scan
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3"
                                    id="rewardAmount"
                                    type="number"
                                    step="0.01"
                                    value={form.rewardAmount}
                                    onChange={(e) => setFormField("rewardAmount", e.target.value)}
                                    placeholder="Enter referrer's reward amount per scan..."
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-bold mb-2" for="dailyLimit">
                                    Daily Redemption Limit
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3"
                                    id="dailyLimit"
                                    type="number"
                                    value={form.dailyLimit}
                                    onChange={(e) => setFormField("dailyLimit", e.target.value)}
                                    placeholder="Enter maximum daily redemption limit..."
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-bold mb-2" for="startDate">
                                    Campaign Start Date
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3"
                                    id="startDate"
                                    type="date"
                                    value={form.startDate}
                                    onChange={(e) => setFormField("startDate", e.target.value)}
                                    placeholder="Enter campaign start date..."
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-bold mb-2" for="duration">
                                    Campaign Duration (Days)
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 mb-3"
                                    id="duration"
                                    type="number"
                                    value={form.duration}
                                    onChange={(e) => setFormField("duration", e.target.value)}
                                    placeholder="Enter campaign duration in days..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-red-500 text-white font-bold p-2 rounded-full w-fit outline-none"
                            >
                                Create
                            </button>
                        </form>
                    }
                </div>
            </div>
        </div>
    );
}

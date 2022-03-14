import React, { useState, useEffect } from 'react';
import { factoryABI, factoryAddress, campaignABI } from '../contracts/constants';
import { ethers } from 'ethers';
import { client } from '../client';
import { campaignQuery, userQuery } from '../utils/data';
import { RiContactsBookLine } from 'react-icons/ri';

export const EthContext = React.createContext();

let eth;

if (typeof window !== 'undefined') {
    eth = window.ethereum;
    console.log(eth);
}

const getFactoryContract = () => {
    const provider = new ethers.providers.Web3Provider(eth);
    const signer = provider.getSigner();
    const factoryContract = new ethers.Contract(
        factoryAddress,
        factoryABI,
        signer
    );

    return factoryContract;
}

const getCampaignContract = (campaignAddress) => {
    const provider = new ethers.providers.Web3Provider(eth);
    const signer = provider.getSigner();
    const factoryContract = new ethers.Contract(
        campaignAddress,
        campaignABI,
        signer
    );

    return factoryContract;
}

export const EthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [currentAccount, setCurrentAccount] = useState();
    const [formData, setFormData] = useState({
        campaignName : '',
        rewardAmount: 0,
        fundingAmount: 0,
        vendorName : '',
        contractAddress : ''
    });

    const [rewardFormData, setRewardFormData] = useState({
        promoterUsername : '',
        promoterUserId: '',
        postId : '',
        promoterAddress : '',
        vendorName : '',
    })

    const handleChange = (e, name) => {
        setFormData(prevState => ({ ...prevState, [name] : e.target.value }))
    }

    const handleRewardChange = (e, name) => {
        setRewardFormData(prevState => ({ ...prevState, [name] : e.target.value }))
    }

    const saveCampaign = async (
        campaignName,
        rewardAmount,
        fundingAmount,
        vendorName,
        campaignAddress) => {
            const campaignDoc = {
                _type : 'campaign',
                _id : campaignAddress,
                campaignName,
                rewardAmount : parseFloat(rewardAmount),
                fundingAmount: parseFloat(fundingAmount),
                vendorName,
                campaignAddress
            };

            await client.createIfNotExists(campaignDoc);
    }

    const createCampaign = async (metamask = eth, connectedAccount = currentAccount) => {
        try {
            if (!metamask) return alert('Please install metamask');

            const { campaignName, rewardAmount, fundingAmount, vendorName } = formData;
            const factoryContract = getFactoryContract();

            const parsedFundingAmount = ethers.utils.parseEther(fundingAmount);
            const parsedRewardAmount = ethers.utils.parseEther(rewardAmount);

            const transactionHash = await factoryContract.createCampaign(
                campaignName,
                parsedRewardAmount,
                parsedFundingAmount
            );

            await transactionHash.wait();

            const campaignCount = await factoryContract.getTotalCampaigns();
            const campaignAddress = await factoryContract.getCampaignAddress(campaignCount - 1);
            const campaignContract = getCampaignContract(campaignAddress);
            await campaignContract.funding({ value : parsedFundingAmount});
            let campaignFunding = await campaignContract.getBalance();
            campaignFunding = ethers.utils.formatEther(campaignFunding);

            console.log('Campaign created successfully!');
            // console.log(transactionHash);
            console.log("Campaign address: ",campaignAddress);
            console.log("Campaign balance: ", campaignFunding);

            // Db call
            await saveCampaign(
                campaignName,
                parsedRewardAmount,
                parsedFundingAmount,
                vendorName,
                campaignAddress
            )

        } catch (err) {
            console.log(err);
        }
    }

    const transferReward = async(metamask = eth, connectedAccount = currentAccount) => {
        if (!metamask) return alert('Please install metamask');
        console.log(rewardFormData);

        const { promoterUsername, promoterUserId, postId, promoterAddress, vendorName } = rewardFormData;
        let campaignDetail;
        const query = campaignQuery(vendorName);
        await client.fetch(query)
            .then((data) => {
                campaignDetail = data[0];
            })
        
        console.log(campaignDetail);

        const ethValue = campaignDetail.rewardAmount / (10 ** 18);
        console.log(ethValue);
        const parsedRewardAmount = ethers.utils.parseEther(ethValue.toString());
        

        const campaignContract = getCampaignContract(campaignDetail.campaignAddress);
        
        await campaignContract.approvePromoter(promoterUsername, promoterUserId, postId, promoterAddress, {gasLimit : 2500000});
        await campaignContract.sendReward(promoterAddress, { value :  parsedRewardAmount });
        const newFundingAmount = campaignDetail.fundingAmount - campaignDetail.rewardAmount;
        
        await client.patch(campaignDetail.campaignAddress)
                .set({fundingAmount : newFundingAmount})
                .commit();
    }
    
    useEffect(() => {
        checkIfWalletIsConnected();
    },[]);


    const connectWallet = async (metamask = eth) => {
        try {
            if (!metamask) return alert('Please install Metamask');
            const accounts = await metamask.request({ method: 'eth_requestAccounts'});
            setCurrentAccount(accounts[0]);

        } catch (err) {
            console.log(err);
        }
    }

    const connectWalletUser = async (userId,metamask = eth) => {
        try {
            if (!metamask) return alert('Please install Metamask');
            const accounts = await metamask.request({ method: 'eth_requestAccounts'});
            console.log(accounts[0]);
    
            await client.patch(userId)
                .set({walletAddress : accounts[0]})
                .commit();

        } catch (err) {
            console.log(err);
        }
    }

    const checkIfWalletIsConnected = async (metamask = eth) => {
        try {
          if (!metamask) return alert('Please install Metamask')
    
          const accounts = await metamask.request({ method: 'eth_requestAccounts' })
    
          if (accounts.length) setCurrentAccount(accounts[0])
        } catch (err) {
          console.log(err)
        }
    }

    return (
        <EthContext.Provider
            value={{
                currentAccount,
                formData,
                rewardFormData,
                connectWallet,
                handleChange,
                handleRewardChange,
                createCampaign,
                transferReward,
                connectWalletUser
            }}
        >
            {children}
        </EthContext.Provider>
    );
}
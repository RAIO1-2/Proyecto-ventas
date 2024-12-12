import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function ToS() {
    return (
        <main className="container">
            <h1 className="my-4 display-4">Terms of Service</h1>

            <p>
                Below are our Terms of Service, which outline important details, but the bottom line is that our aim is to always take care
                of both you as a customer and as a seller on our platform. We’ve included these terms to legally protect ourselves.
                However, if you have any concerns, feel free to email us at{' '}
                <a href="mailto:test@example.com" className="text-decoration-none">test@example.com</a>{' '}
                and we will do our best to resolve them in a fair and timely manner.
            </p>

            <ol>
                <li className="mb-3">
                    <strong>Application of Terms</strong>
                    <ol>
                        <li>
                            By visiting and/or taking any action on Bootstrap Themes, you confirm that you are in agreement with and bound by the
                            terms outlined below. These terms apply to the website, emails, or any other communication.
                        </li>
                    </ol>
                </li>

                <li className="mb-3">
                    <strong>Themes</strong>
                    <ol>
                        <li>All products are 100% digital and delivered electronically to your email.</li>
                        <li>
                            Bootstrap Themes is not responsible for you not receiving your theme if you fail to provide a valid email or for
                            technical issues outside our control.
                        </li>
                    </ol>
                </li>

                <li className="mb-3">
                    <strong>Security &amp; Payments</strong>
                    <ol>
                        <li>
                            All payments are processed securely through PayPal or Stripe. Bootstrap Themes does not directly process payments
                            through the website.
                        </li>
                    </ol>
                </li>

                <li className="mb-3">
                    <strong>Refunds</strong>
                    <ol>
                        <li>
                            You have 14 days to evaluate your purchase. If your purchase fails to meet expectations set by the seller, or is
                            critically flawed in some way, contact Bootstrap Themes and we will issue a full refund pending a review.
                        </li>
                        <li>The issue of refunds is at the complete discretion of Bootstrap Themes.</li>
                    </ol>
                </li>

                <li className="mb-3">
                    <strong>Support</strong>
                    <ol>
                        <li>Support for a purchase is governed by the usage license you purchase.</li>
                    </ol>
                </li>

                <li className="mb-3">
                    <strong>Ownership</strong>
                    <ol>
                        <li>Ownership of the product is governed by the usage licenses.</li>
                    </ol>
                </li>

                <li className="mb-3">
                    <strong>Membership &amp; Content</strong>
                    <ol>
                        <li>
                            Membership is a benefit for those who follow our terms and policies. We may at any time suspend or terminate your account.
                        </li>
                        <li>
                            We can view and/or remove any content for any reason at our own discretion. This will typically only be exercised for
                            issues needing immediate resolution, such as, but not limited to, the posting of unauthorized content, offensive content,
                            illegal content, or anything breaching anyone else’s rights.
                        </li>
                    </ol>
                </li>

                <li className="mb-3">
                    <strong>Liability</strong>
                    <ol>
                        <li>
                            You indemnify us against all losses, costs (including legal costs), expenses, demands or liability that we incur arising
                            out of, or in connection with, any claims against us relating to your use of Bootstrap Themes.
                        </li>
                    </ol>
                </li>

                <li className="mb-3">
                    <strong>Requesting, Modifying or Deleting Your Data (GDPR)</strong>
                    <ol>
                        <li>
                            We are a small operation, but we work hard to make sure your data remains safe and we only collect what is needed to provide our services. If you want to request an export of your data, a modification to any data we have related to your account, or delete all data permanently, please email{' '}
                            <a href="mailto:test@example.com" className="text-decoration-none">test@example.com</a> and we’ll complete your request in a timely manner.
                        </li>
                    </ol>
                </li>

                <li className="mb-5">
                    <strong>Changes to Terms</strong>
                    <ol>
                        <li>If we change our terms of use, we will post those changes on this page.</li>
                    </ol>
                </li>
            </ol>
        </main>
    );
}

export default ToS;

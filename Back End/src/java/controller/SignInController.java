package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import java.io.IOException;
import java.util.Arrays;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import util.HibernateUtil;

@WebServlet(name = "SignInController", urlPatterns = {"/SignInController"})
public class SignInController extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Get parameters from request
        String countryCode = request.getParameter("countryCode");
        String contactNo = request.getParameter("contactNo");

        // Log received parameters for debugging
        System.out.println("Received countryCode: [" + countryCode + "]");
        System.out.println("Received contactNo: [" + contactNo + "]");

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            // Validate input
            if (countryCode == null || countryCode.trim().isEmpty()) {
                responseObject.addProperty("status", false);
                responseObject.addProperty("message", "Country code is required");
            } else if (contactNo == null || contactNo.trim().isEmpty()) {
                responseObject.addProperty("status", false);
                responseObject.addProperty("message", "Contact number is required");
            } else {
                // Normalize contact number
                contactNo = contactNo.trim();
                // Remove any spaces or dashes
                contactNo = contactNo.replaceAll("\\s+", "");

                Session session = HibernateUtil.getSessionFactory().openSession();
                try {
                    // Create criteria
                    Criteria criteria = session.createCriteria(User.class);
                    criteria.add(Restrictions.eq("countryCode", countryCode.trim()));

                    // Flexible matching: match number as-is OR add/remove leading 0
                    criteria.add(
                        Restrictions.or(
                            Restrictions.eq("contactNo", contactNo),
                            Restrictions.eq("contactNo", contactNo.startsWith("0") ? contactNo.substring(1) : "0" + contactNo)
                        )
                    );

                    User user = (User) criteria.uniqueResult();

                    if (user != null) {
                        // User found
                        responseObject.addProperty("status", true);
                        responseObject.addProperty("message", "Sign in successful");
                        responseObject.addProperty("userId", user.getId());

                        JsonObject userObject = new JsonObject();
                        userObject.addProperty("id", user.getId());
                        userObject.addProperty("firstName", user.getFirstName());
                        userObject.addProperty("lastName", user.getLastName());
                        userObject.addProperty("countryCode", user.getCountryCode());
                        userObject.addProperty("contactNo", user.getContactNo());
                        userObject.addProperty("status", user.getStatus().toString());

                        responseObject.add("user", userObject);
                    } else {
                        // User not found
                        responseObject.addProperty("status", false);
                        responseObject.addProperty("message", "Invalid phone number or user not found");
                    }
                } finally {
                    session.close();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            responseObject.addProperty("status", false);
            responseObject.addProperty("message", "Server error: " + e.getMessage());
        }

        // Send JSON response
        response.getWriter().write(gson.toJson(responseObject));
    }
}
